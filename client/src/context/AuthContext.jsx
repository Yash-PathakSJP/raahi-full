import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('raahi_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
    } catch (err) {
      localStorage.removeItem('raahi_token');
      localStorage.removeItem('raahi_user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const persistSession = (data) => {
    if (data.token) localStorage.setItem('raahi_token', data.token);
    if (data.user) {
      localStorage.setItem('raahi_user', JSON.stringify(data.user));
      setUser(data.user);
    }
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    persistSession(data);
    return data;
  };

  const signup = async (payload) => {
    const { data } = await api.post('/auth/signup', payload);
    return data;
  };

  const verifyOtp = async (email, otp) => {
    const { data } = await api.post('/auth/verify-otp', { email, otp });
    persistSession(data);
    return data;
  };

  const resendOtp = async (email) => {
    const { data } = await api.post('/auth/resend-otp', { email });
    return data;
  };

  const forgotPassword = async (email) => {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  };

  const resetPassword = async (resetToken, password, confirmPassword) => {
    const { data } = await api.put(`/auth/reset-password/${resetToken}`, {
      password,
      confirmPassword,
    });
    persistSession(data);
    return data;
  };

  const oauthLogin = async (provider) => {
    // In production, this would receive a verified ID token from the
    // provider's SDK popup flow. Here we surface a clear stub.
    throw new Error(
      `${provider} sign-in requires OAuth app credentials to be configured. See README for setup.`
    );
  };

  const logout = async () => {
    try {
      await api.get('/auth/logout');
    } catch (err) {
      // ignore network errors on logout
    }
    localStorage.removeItem('raahi_token');
    localStorage.removeItem('raahi_user');
    setUser(null);
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedFields };
      localStorage.setItem('raahi_user', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        verifyOtp,
        resendOtp,
        forgotPassword,
        resetPassword,
        oauthLogin,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

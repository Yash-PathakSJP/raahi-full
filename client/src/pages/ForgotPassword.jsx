import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPassword(email.trim());
      setSent(true);
      toast.success('Reset link sent! Check your inbox.');
      if (res.devResetUrl) console.info(`[DEV] Reset URL: ${res.devResetUrl}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>

        <div className="card p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50">
            <Lock className="h-8 w-8 text-brand-600" />
          </div>

          <h2 className="mt-5 font-display text-2xl font-bold text-gray-900">Forgot Password?</h2>
          <p className="mt-2 text-sm text-gray-500">
            No worries! Enter your email and we'll send you a link to reset your password.
          </p>

          {sent ? (
            <div className="mt-6 rounded-xl bg-brand-50 p-4 text-sm text-brand-800">
              We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and spam folder.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 text-left">
              <label htmlFor="forgotEmail" className="mb-1.5 block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="forgotEmail"
                type="email"
                autoComplete="email"
                className="input-field"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button type="submit" disabled={loading} className="btn-primary mt-5 w-full">
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>
          )}

          <Link to="/login" className="mt-5 inline-block text-sm font-medium text-gray-500 hover:text-gray-700">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

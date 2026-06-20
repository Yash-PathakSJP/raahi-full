import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import AuthSidePanel from '../components/AuthSidePanel';
import Logo from '../components/Logo';
import SocialAuthButtons from '../components/SocialAuthButtons';

const STATS = [
  { value: '10K+', label: 'Happy Travelers' },
  { value: '500+', label: 'Trips Planned' },
  { value: '50+', label: 'Countries' },
];

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email';
    if (!form.password) next.password = 'Password is required';
    else if (form.password.length < 8) next.password = 'Must be at least 8 characters';
    if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match';
    if (!agree) next.agree = 'Please accept the Terms & Privacy Policy';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await signup(form);
      toast.success('Account created! Verify your email to continue.');
      navigate('/verify-otp', { state: { email: res.email, devOtp: res.devOtp } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthSidePanel
        heading="Start Your"
        highlight="Journey Today!"
        sub="Join Raahi and connect with travelers, explore new places and create memories."
      />

      <div className="flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md">
          <div className="mb-6 flex justify-center lg:hidden">
            <Logo />
          </div>

          <div className="card p-8">
            <h2 className="font-display text-2xl font-bold text-gray-900">Create Your Account</h2>
            <p className="mt-1 text-sm text-gray-500">Let's get you started! 🎒</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              <div>
                <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  className="input-field"
                  placeholder="Enter your full name"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  aria-invalid={!!errors.fullName}
                />
                {errors.fullName && <p className="mt-1 text-xs text-rose-500">{errors.fullName}</p>}
              </div>

              <div>
                <label htmlFor="signupEmail" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="signupEmail"
                  type="email"
                  autoComplete="email"
                  className="input-field"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  aria-invalid={!!errors.email}
                />
                {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="signupPassword" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="signupPassword"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="input-field pr-11"
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    aria-invalid={!!errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-rose-500">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="input-field pr-11"
                    placeholder="Confirm your password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    aria-invalid={!!errors.confirmPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-rose-500">{errors.confirmPassword}</p>
                )}
              </div>

              <div>
                <label className="flex cursor-pointer items-start gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span>
                    I agree to the{' '}
                    <a href="#terms" className="font-medium text-brand-600 hover:underline">Terms & Conditions</a> and{' '}
                    <a href="#privacy" className="font-medium text-brand-600 hover:underline">Privacy Policy</a>
                  </span>
                </label>
                {errors.agree && <p className="mt-1 text-xs text-rose-500">{errors.agree}</p>}
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Creating account…' : 'Sign Up'}
              </button>
            </form>

            <SocialAuthButtons theme="light" />

            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
                Login
              </Link>
            </p>
          </div>

          <div className="mt-6 hidden grid-cols-3 gap-3 lg:grid">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-xl bg-white p-3 text-center shadow-card">
                <p className="font-display text-lg font-bold text-brand-600">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


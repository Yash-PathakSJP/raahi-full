import { useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const { resetToken } = useParams();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const checks = useMemo(
    () => ({
      length: password.length >= 8,
      number: /\d/.test(password),
      upper: /[A-Z]/.test(password),
    }),
    [password]
  );

  const allValid = checks.length && checks.number && checks.upper;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!allValid) {
      toast.error('Password does not meet all requirements');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(resetToken, password, confirmPassword);
      toast.success('Password updated successfully!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  const Requirement = ({ met, label }) => (
    <li className={`flex items-center gap-1.5 text-xs ${met ? 'text-emerald-600' : 'text-gray-400'}`}>
      {met ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
      {label}
    </li>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>

        <div className="card p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50">
            <ShieldCheck className="h-8 w-8 text-brand-600" />
          </div>

          <h2 className="mt-5 font-display text-2xl font-bold text-gray-900">Reset Password</h2>
          <p className="mt-2 text-sm text-gray-500">Enter your new password below.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
            <div>
              <label htmlFor="newPassword" className="mb-1.5 block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-11"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </div>

            <div>
              <label htmlFor="confirmNewPassword" className="mb-1.5 block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmNewPassword"
                  type={showConfirm ? 'text' : 'password'}
                  className="input-field pr-11"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
            </div>

            <ul className="space-y-1.5 rounded-xl bg-gray-50 p-3">
              <Requirement met={checks.length} label="At least 8 characters" />
              <Requirement met={checks.number} label="Includes a number" />
              <Requirement met={checks.upper} label="Includes an uppercase letter" />
            </ul>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Updating…' : 'Update Password'}
            </button>
          </form>

          <Link to="/login" className="mt-5 inline-block text-sm font-medium text-gray-500 hover:text-gray-700">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

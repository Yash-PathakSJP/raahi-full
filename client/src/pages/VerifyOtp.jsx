import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const RESEND_SECONDS = 45;

export default function VerifyOtp() {
  const { verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const [digits, setDigits] = useState(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(RESEND_SECONDS);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (!email) {
      navigate('/signup', { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (location.state?.devOtp) {
      console.info(`[DEV] OTP for ${email}: ${location.state.devOtp}`);
    }
  }, [email, location.state]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setInterval(() => setResendIn((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendIn]);

  const handleChange = (idx, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[idx] = value;
    setDigits(next);
    if (value && idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = pasted.split('');
    while (next.length < 6) next.push('');
    setDigits(next);
    inputsRef.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = digits.join('');
    if (otp.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    try {
      await verifyOtp(email, otp);
      toast.success('Account verified!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired code');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const res = await resendOtp(email);
      toast.success('A new code has been sent');
      setResendIn(RESEND_SECONDS);
      if (res.devOtp) console.info(`[DEV] New OTP: ${res.devOtp}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not resend code');
    }
  };

  const mm = String(Math.floor(resendIn / 60)).padStart(2, '0');
  const ss = String(resendIn % 60).padStart(2, '0');

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>

        <div className="card p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50">
            <Mail className="h-8 w-8 text-brand-600" />
          </div>

          <h2 className="mt-5 font-display text-2xl font-bold text-gray-900">Verify Your Account</h2>
          <p className="mt-2 text-sm text-gray-500">
            We have sent a 6-digit code to <br />
            <span className="font-semibold text-gray-800">{email}</span>{' '}
            <Link to="/signup" className="font-medium text-brand-600 hover:underline">Edit</Link>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mt-6 flex justify-center gap-2" onPaste={handlePaste}>
              {digits.map((d, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputsRef.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="h-12 w-12 rounded-xl border border-gray-200 text-center text-lg font-bold text-gray-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none"
                  aria-label={`Digit ${idx + 1}`}
                />
              ))}
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Didn't receive the code?{' '}
              {resendIn > 0 ? (
                <span>Resend in {mm}:{ss}</span>
              ) : (
                <button type="button" onClick={handleResend} className="font-semibold text-brand-600 hover:underline">
                  Resend
                </button>
              )}
            </p>

            <button type="submit" disabled={loading} className="btn-primary mt-6 w-full">
              {loading ? 'Verifying…' : 'Verify & Continue'}
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

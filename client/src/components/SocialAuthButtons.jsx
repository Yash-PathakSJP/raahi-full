import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const PROVIDERS = [
  {
    id: 'google',
    label: 'Google',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.99 10.99 0 0012 23z" />
        <path fill="#FBBC05" d="M5.84 14.09a6.6 6.6 0 010-4.18V7.07H2.18a11 11 0 000 9.86l3.66-2.84z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A10.99 10.99 0 002.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
    ),
  },
  {
    id: 'facebook',
    label: 'Facebook',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="#1877F2">
        <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.91h-2.33V22c4.78-.79 8.44-4.94 8.44-9.94z" />
      </svg>
    ),
  },
  {
    id: 'apple',
    label: 'Apple',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.36 1.43c0 1.14-.46 2.2-1.2 3-.8.86-2.1 1.52-3.18 1.43-.14-1.1.43-2.26 1.16-3.02.8-.84 2.2-1.46 3.22-1.41zm3.3 16.27c-.45 1.04-.66 1.5-1.24 2.42-.81 1.28-1.96 2.88-3.38 2.9-1.26.02-1.58-.82-3.29-.81-1.71.01-2.06.83-3.33.81-1.42-.02-2.5-1.45-3.31-2.73-2.27-3.57-2.5-7.75-1.1-9.98.99-1.58 2.56-2.5 4.03-2.5 1.5 0 2.44.83 3.68.83 1.2 0 1.93-.83 3.68-.83 1.31 0 2.7.71 3.69 1.95-3.25 1.78-2.72 6.4.57 7.94z" />
      </svg>
    ),
  },
];

export default function SocialAuthButtons({ theme = 'dark' }) {
  const { oauthLogin } = useAuth();
  const isDark = theme === 'dark';

  const handleClick = async (providerId, label) => {
    try {
      await oauthLogin(providerId);
    } catch (err) {
      toast.error(err.message || `${label} sign-in isn't configured yet.`);
    }
  };

  return (
    <div className="mt-6">
      <div className="relative flex items-center">
        <div className={`flex-1 border-t ${isDark ? 'border-raahi-border' : 'border-gray-200'}`} />
        <span className={`px-3 text-xs uppercase tracking-wide ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          or continue with
        </span>
        <div className={`flex-1 border-t ${isDark ? 'border-raahi-border' : 'border-gray-200'}`} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {PROVIDERS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => handleClick(p.id, p.label)}
            className={
              isDark
                ? 'flex items-center justify-center gap-2 rounded-xl border border-raahi-border bg-white/5 py-2.5 text-sm font-medium text-gray-200 transition hover:bg-white/10'
                : 'flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50'
            }
            aria-label={`Continue with ${p.label}`}
          >
            {p.icon}
            <span className="hidden sm:inline">{p.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Logo({ light = false, size = 'md' }) {
  const sizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2 font-display font-extrabold ${sizes[size]} ${light ? 'text-white' : 'text-raahi-navy'}`}>
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <defs>
          <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7C3AED" />
            <stop offset="1" stopColor="#EC4899" />
          </linearGradient>
        </defs>
        <path
          d="M16 2C8.27 2 2 8.27 2 16s6.27 14 14 14 14-6.27 14-14S23.73 2 16 2zm0 4a2 2 0 110 4 2 2 0 010-4zm0 20a10.02 10.02 0 01-8-4c.04-2.67 5.33-4.13 8-4.13S23.96 19.33 24 22a10.02 10.02 0 01-8 4z"
          fill="url(#logo-grad)"
        />
      </svg>
      <span className="tracking-tight">RAAHI</span>
    </div>
  );
}

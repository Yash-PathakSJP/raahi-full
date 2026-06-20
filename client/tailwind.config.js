/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Deep navy backdrop used on the dark auth panel & sidebar
        raahi: {
          navy: '#171134',
          navydeep: '#120D29',
          card: '#1E1840',
          border: '#2D2655',
        },
        // Signature purple-to-pink brand gradient
        brand: {
          50: '#F5F2FF',
          100: '#EDE7FF',
          200: '#D9CCFF',
          300: '#BCA3FF',
          400: '#9D72FF',
          500: '#8B4FF2',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        accent: {
          pink: '#EC4899',
          rose: '#F43F5E',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
        'navy-gradient': 'linear-gradient(180deg, #1A1438 0%, #0F0B24 100%)',
      },
      boxShadow: {
        glow: '0 0 0 4px rgba(124, 58, 237, 0.15)',
        card: '0 4px 24px rgba(20, 14, 50, 0.08)',
        'card-dark': '0 8px 32px rgba(0, 0, 0, 0.35)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#141826',
        mist: '#edf2f7',
        sand: '#f6f1e8',
        ember: '#d0683d',
        pine: '#1f4d4b',
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      boxShadow: {
        panel: '0 18px 48px rgba(20, 24, 38, 0.10)',
      },
      backgroundImage: {
        'admin-grid': 'radial-gradient(circle at top, rgba(31,77,75,0.10), transparent 30%), linear-gradient(180deg, rgba(246,241,232,0.55), rgba(255,255,255,0.92))',
      },
    },
  },
  plugins: [],
};

export default config;
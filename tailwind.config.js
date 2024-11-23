/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0F172A',
        foreground: '#E2E8F0',
        primary: {
          DEFAULT: '#3B82F6',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#475569',
          foreground: '#E2E8F0',
        },
        accent: {
          DEFAULT: '#F59E0B',
          foreground: '#FFFFFF',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
      },
    },
  },
  plugins: [],
};
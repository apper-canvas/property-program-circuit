/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2C3E50',
          50: '#BDC3C7',
          100: '#A8B2B8',
          200: '#7E8B93',
          300: '#54646E',
          400: '#3D5568',
          500: '#2C3E50',
          600: '#263746',
          700: '#20303C',
          800: '#1A2832',
          900: '#142128'
        },
        secondary: {
          DEFAULT: '#E67E22',
          50: '#F8E3D3',
          100: '#F5D4B8',
          200: '#EFB588',
          300: '#E99658',
          400: '#E67E22',
          500: '#D35400',
          600: '#A34300',
          700: '#733000',
          800: '#431C00',
          900: '#140900'
        },
        accent: {
          DEFAULT: '#3498DB',
          50: '#EBF5FF',
          100: '#D1E9FF',
          200: '#A6D4FF',
          300: '#7CBFFF',
          400: '#51A9FF',
          500: '#3498DB',
          600: '#2980B9',
          700: '#206694',
          800: '#174C70',
          900: '#0E324B'
        },
        surface: {
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
        },
        success: '#27AE60',
        warning: '#F39C12',
        error: '#E74C3C',
        info: '#3498DB'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui']
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem'
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem'
      },
      boxShadow: {
        'card': '0 4px 8px 0 rgba(0, 0, 0, 0.1)',
        'card-hover': '0 8px 16px 0 rgba(0, 0, 0, 0.15)',
        'nav': '0 2px 4px 0 rgba(0, 0, 0, 0.1)'
      }
    },
  },
  plugins: [],
}
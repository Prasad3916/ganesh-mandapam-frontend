/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#FFF5ED',
          100: '#FFE5D1',
          200: '#FFC8A3',
          300: '#FFA46B',
          400: '#FF7B33',
          500: '#E65100', // Terracotta Warm Saffron Primary
          600: '#CC4400',
          700: '#B83200',
          800: '#912705',
          900: '#75220B',
        },
        gold: {
          50: '#FFFDF0',
          100: '#FFF9C2',
          200: '#FFF085',
          300: '#FFE247',
          400: '#FCD116',
          500: '#D4AF37', // Muted Temple Gold
          600: '#AA851C',
          700: '#836114',
          800: '#674B16',
          900: '#543C16',
        },
        maroon: {
          50: '#FDF2F4',
          100: '#FBE4E7',
          200: '#F7CBD2',
          300: '#F0A3AF',
          400: '#E47185',
          500: '#A31C37',
          600: '#800B22',
          700: '#500B17', // Deep Temple Maroon
          800: '#3D020D',
          900: '#230006',
          950: '#140003',
        },
        cream: {
          50: '#FFFEFA',
          100: '#FFFDD0', // Warm Ivory
          200: '#FAF5EE',
        },
        temple: {
          dark: '#16080C',
          cardDark: '#230D15',
          borderDark: '#4A1D2B',
          lightBg: '#FAF5EE',
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Noto Sans Telugu', 'sans-serif'],
        telugu: ['Noto Sans Telugu', 'Noto Serif Telugu', 'sans-serif'],
      },
      boxShadow: {
        'mandapam': '0 10px 25px -5px rgba(80, 11, 23, 0.2)',
        'card-clean': '0 2px 8px 0 rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s infinite ease-in-out',
        'petal-fall': 'petalFall 14s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.7' },
        },
        petalFall: {
          '0%': { transform: 'translateY(-10vh) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(110vh) rotate(360deg)', opacity: '0.2' },
        }
      }
    },
  },
  plugins: [],
}

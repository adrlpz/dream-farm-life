/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        farm: {
          grass: '#7ec850',
          soil: '#8b6914',
          soilDark: '#6b4f10',
          water: '#4a90d9',
          wood: '#a0522d',
          gold: '#ffd700',
          leaf: '#4a7c3f',
        },
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-grow': 'pulse-grow 0.3s ease-out',
        'shake': 'shake 0.5s ease-in-out',
      },
      keyframes: {
        'pulse-grow': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
      },
    },
  },
  plugins: [],
}

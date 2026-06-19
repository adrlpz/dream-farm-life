/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        farm: {
          green: '#4CAF50',
          'green-dark': '#388E3C',
          brown: '#8D6E63',
          'brown-dark': '#6D4C41',
          gold: '#FFD700',
          sky: '#87CEEB',
          cream: '#FFF8E1',
          soil: '#5D4037',
        },
      },
      fontFamily: {
        display: ['Quicksand', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

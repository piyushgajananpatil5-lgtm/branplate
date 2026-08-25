/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'wheat-gold': '#E3B550',
        'bran-brown': '#5D4037',
        'leaf-green': '#4CAF50',
        cream: '#FDFBF7',
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};

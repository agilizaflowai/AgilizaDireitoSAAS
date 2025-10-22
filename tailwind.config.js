/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      spacing: {
        '30': '7.5rem', // habilita utilitário w-30
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          nubank: '#820ad1',
          bradesco: '#cc092f',
          c6: '#242424',
          mp: '#009ee3',
        }
      },
    },
  },
  plugins: [],
};
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#16a34a',
          dark: '#166534',
        },
        nude: {
          50: '#f8f3f0',
          100: '#efe5de',
          200: '#e6d7cd',
          300: '#dcc8bb',
          400: '#d1b9aa',
          500: '#c7aa99',
          600: '#b89386',
          700: '#a1796c',
          800: '#836257',
          900: '#6a5047',
        },
      },
    },
  },
  plugins: [],
};

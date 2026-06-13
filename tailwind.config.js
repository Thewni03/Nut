/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Primary base (60%) - warm almond/oat
        almond: {
          DEFAULT: '#F4EDE2',
          light: '#FAF6EF',
          dark: '#EADFCC',
        },
        // Secondary base (20%) - deep walnut brown
        walnut: {
          DEFAULT: '#4A352A',
          light: '#6B4F3F',
          dark: '#33231A',
        },
        // Statement accent (15%) - sage/olive green
        sage: {
          DEFAULT: '#8C9574',
          light: '#A8B091',
          dark: '#6E7659',
        },
        // Luxury highlight (5%) - brushed brass/gold
        brass: {
          DEFAULT: '#B8924F',
          light: '#D1B27C',
          dark: '#94733A',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        shelf: '0 6px 16px -4px rgba(74, 53, 42, 0.18)',
        card: '0 2px 10px -2px rgba(74, 53, 42, 0.12)',
      },
    },
  },
  plugins: [],
}

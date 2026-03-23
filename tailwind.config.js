/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ['Figtree', 'system-ui', 'sans-serif'] },
      colors: {
        p: { 900: '#89123E', 600: '#E31B53', 300: '#FEA3B4', 100: '#FFE4E8' },
        head: '#181D27', sub: '#535862', inact: '#A4A7AE',
        divider: '#E9EAEB', surface: '#F5F5F5',
      },
    },
  },
  plugins: [],
}

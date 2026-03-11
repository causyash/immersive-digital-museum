/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        museum: {
          bg: '#0a0a0a',
          surface: '#171717',
          border: '#262626',
          text: '#f5f5f5',
          muted: '#a3a3a3',
          accent: '#cfa670'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Bodoni Moda', 'serif'],
      }
    },
  },
  plugins: [],
}

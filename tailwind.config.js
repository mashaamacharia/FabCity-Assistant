/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fabcity-green': '#3EB489',
        'fabcity-yellow': '#FFA62B',
        'fabcity-blue': '#1C5D99',
      },
      animation: {
        'bounce-slow': 'bounce 1.4s infinite',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: '#A62C28',
        primary: '#DED0C9',
        secondary: '#0F0D0C',
      },
      backgroundColor: {
        DEFAULT: '#0d0d0d',
      },
      textColor: {
        DEFAULT: '#DED0C9',
      }
    },
  },
  plugins: [],
}
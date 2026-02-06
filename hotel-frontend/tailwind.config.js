/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#1e3c59',
        'accent': '#cda348',
        'bg-light': '#f8fafc',
      },
    },
  },
  plugins: [],
}

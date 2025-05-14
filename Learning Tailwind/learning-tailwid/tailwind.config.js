/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.tsx", 
    "./src/**/*.ts",
    "./app/**/*.{ts,tsx}",
  ],

  theme: {
    extend: {   
      gridTemplateColumns: {
        app: 'minmax(18rem, 20rem) 1fr',
      },
      maxWidth: {
        app: '700px',
      },
    },
  },
  plugins: [],
}

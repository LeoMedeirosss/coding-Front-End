/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.tsx", 
  ],

  theme: {
    extend: {   
      colors: {
        green: {
          500: '#008100',
        },
      },
    },
  },
  plugins: [],
}

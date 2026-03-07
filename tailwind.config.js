/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#0f6644',
          'green-mid': '#1a7a52',
          'green-light': '#eaf5f0',
          'green-bright': '#2db87a',
          orange: '#e04e0a',
          'orange-light': '#fdf0ea',
          ink: '#0f1a14',
          'ink-mid': '#4a4235',
          'ink-faint': '#9a8f7a',
          bg: '#f7f4ef',
          paper: '#ffffff',
          line: '#ede8df',
        }
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
      }
    },
  },
  plugins: [],
}

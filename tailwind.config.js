/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neo: {
          yellow: '#FFE600',
          cyan: '#00F5FF',
          pink: '#FF4D8D',
          orange: '#FF7A00',
          purple: '#B75DFF',
          green: '#22E576',
          lime: '#CCFF00',
          red: '#FF3344',
          blue: '#2563EB',
          cream: '#FFFDF0',
          bg: '#FFFDF0',
          darkBg: '#0F1117',
          darkCard: '#1A1D26',
          border: '#000000',
        }
      },
      boxShadow: {
        'neo-xs': '2px 2px 0px 0px #000',
        'neo-sm': '3px 3px 0px 0px #000',
        'neo': '5px 5px 0px 0px #000',
        'neo-md': '7px 7px 0px 0px #000',
        'neo-lg': '10px 10px 0px 0px #000',
        'neo-xl': '14px 14px 0px 0px #000',
        'neo-white': '5px 5px 0px 0px #FFFFFF',
        'neo-yellow': '5px 5px 0px 0px #FFE600',
        'neo-pink': '5px 5px 0px 0px #FF4D8D',
        'neo-cyan': '5px 5px 0px 0px #00F5FF',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
        '5': '5px',
        '6': '6px',
      }
    },
  },
  plugins: [],
}

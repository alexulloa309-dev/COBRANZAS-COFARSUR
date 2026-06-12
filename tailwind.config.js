module.exports = {
  darkMode: 'class', // enable class based dark mode
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0d6efd', // deep blue
          50: '#e8f0fe',
          100: '#c6dbfe',
          200: '#9cc2ff',
          300: '#73a9ff',
          400: '#4a91ff',
          500: '#0d6efd',
          600: '#0052cc',
          700: '#003a99',
          800: '#002266',
          900: '#000d33',
        },
        accent: {
          DEFAULT: '#ff5a5f', // vivid red
          50: '#ffe5e6',
          100: '#ffb9bb',
          200: '#ff8c90',
          300: '#ff5f64',
          400: '#ff3329',
          500: '#ff0a00',
          600: '#e60000',
          700: '#b30000',
          800: '#800000',
          900: '#4d0000',
        },
        teal: {
          DEFAULT: '#20c997',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

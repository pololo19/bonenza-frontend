/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      transitionProperty: {
        height: 'height',
        spacing: 'margin, padding',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        primary: 'linear-gradient(to right, #06DAC4, #06DAC4, #06DAC4, #06DAC4)',
        'gradient-layer':
          'linear-gradient(180deg, rgba(18, 23, 33, 0.85) 0%, rgba(44, 47, 51, 0.85) 0.01%, rgba(34, 43, 60, 0.816) 48.96%, rgba(44, 47, 51, 0.85) 100%)',
        'btn-gradient': 'linear-gradient(180deg, #F37E7E 0%, #CE0000 100%)',
        second: 'linear-gradient(180deg, #EDB652 0%, #E79D3D 30.21%, #FFFD8F 54.69%, #E79D3D 80.21%, #EDB652 100%)',
        'radial-bg-black':
          'radial-gradient(50% 50% at 50% 50%, rgba(36, 38, 41, 0.95) 0%, rgba(24, 25, 27, 0.95) 0.01%, #242629 100%)',
        'bg-table':
          'radial-gradient(circle at center,rgba(0,0,0, 0),rgba(0,0,0, 100)),url(/img/page/bg-table-home-page.png)',
        'btn-bg-warning': 'linear-gradient(95.56deg, #EEAA2B 8.9%, #8E600B 91.11%)',
        active: 'rgba(246, 27, 79, 0.2)',
      },
      colors: {
        primary: 'linear-gradient(209.24deg, #E5944B 35.23%, #CC6228 73.92%)',
        second: 'linear-gradient(180deg, #EDB652 0%, #E79D3D 30.21%, #FFFD8F 54.69%, #E79D3D 80.21%, #EDB652 100%)',
      },
      width: {
        custom: 'calc(var(--width) * 1%)',
      },
      fontFamily: {
        dayOne: ['"Days One"', 'sans-serif'],
        BlakaInk: ['"Blaka Ink"', 'cursive'],
        Poppins: ['"Poppins"', 'sans-serif'],
        Casino: ['"Casino Shadow"', 'embedded-opentype'],
      },
      borderRadius: {
        none: '0',
        sm: '0.125rem',
        DEFAULT: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        full: '9999px',
        large: '12px',
        20: '20px',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
  mode: 'jit',
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {};
      for (let i = 0; i <= 100; i++) {
        newUtilities[`.w-[${i}%]`] = {
          '--width': i,
          width: 'var(--width)',
        };
      }
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};

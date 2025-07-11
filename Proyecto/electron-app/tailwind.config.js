/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/renderer/index.html', './src/renderer/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        // Colores personalizados del proyecto
        cream: {
          50: '#FDFBF8',
          100: '#F9F6F2',
        },
        orange: {
          400: '#E58D4B',
          500: '#C05621',
        },
        aperitivo: '#FEEBC8',
        digestivo: '#D6EAF8',
      },
    },
  },
  plugins: [],
};

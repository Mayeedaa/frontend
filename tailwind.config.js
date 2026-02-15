/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'baby-pink': {
          50: '#fff9f9',
          100: '#ffe0e6',
          200: '#ffc0d9',
          300: '#ffb3d9',
          400: '#ff99cc',
          500: '#ff80bf',
          600: '#ff66b2',
          700: '#ff4da6',
          800: '#ff3399',
          900: '#e6007a',
          950: '#b20066',
        },
      },
      backgroundImage: {
        'gradient-bebe': 'linear-gradient(135deg, #ffe0e6 0%, #ffb3d9 25%, #ff99cc 50%, #ffb3d9 75%, #ffe0e6 100%)',
        'gradient-bebe-soft': 'linear-gradient(180deg, #fff9f9 0%, #ffe0e6 50%, #ffb3d9 100%)',
        'gradient-bebe-warm': 'linear-gradient(135deg, #ffb3d9 0%, #ff99cc 50%, #ffc0d9 100%)',
        'gradient-bebe-vibrant': 'linear-gradient(135deg, #ff80bf 0%, #ff66b2 50%, #ff99cc 100%)',
      }
    }
  },
  plugins: []
};

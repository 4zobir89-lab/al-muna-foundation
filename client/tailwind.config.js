/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: { 50: '#fefcf5', 100: '#fdf8e8', 200: '#faf0c9', 300: '#f5e0a0', 400: '#ecc86d', 500: '#e0b04a', 600: '#c99436', 700: '#a8752f', 800: '#8b5e2e', 900: '#744e2a' },
        gold: { 50: '#fef8e7', 100: '#fdf0c5', 200: '#fbde88', 300: '#f8c74a', 400: '#f5b22a', 500: '#e09412', 600: '#c2750c', 700: '#9b560e', 800: '#7e4513', 900: '#6b3915' },
        brown: { 50: '#faf6f0', 100: '#f3ebe0', 200: '#e5d5bb', 300: '#d4ba8f', 400: '#c29e65', 500: '#b38848', 600: '#a06e3c', 700: '#855634', 800: '#6e4731', 900: '#5d3d2c' },
        dark: { 50: '#f6f5f3', 100: '#eae7e0', 200: '#d2ccc0', 300: '#b6ab98', 400: '#9e9078', 500: '#8d7b65', 600: '#7b6956', 700: '#665648', 800: '#55483d', 900: '#3a3029' },
      },
      fontFamily: {
        amiri: ['Amiri', 'serif'],
        noto: ['Noto Naskh Arabic', 'serif'],
        cairo: ['Cairo', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(30px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
};

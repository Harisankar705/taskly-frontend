/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#752092',
          light: '#8A3CA6',
          dark: '#5F1A75',
        },
        secondary: {
          DEFAULT: '#C957BC',
          light: '#D479CB',
          dark: '#B13EAA',
        },
        accent: {
          DEFAULT: '#872',
          light: '#9A8334',
          dark: '#756218',
        },
        cream: {
          DEFAULT: '#FFE3B3',
          light: '#FFEDC7',
          dark: '#FFD990',
        },
        status: {
          pending: '#FFB020',
          'in-progress': '#3F88FC',
          completed: '#10B981',
        },
        priority: {
          high: '#EF4444',
          medium: '#F59E0B',
          low: '#10B981',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-in-out',
        'slide-down': 'slideDown 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
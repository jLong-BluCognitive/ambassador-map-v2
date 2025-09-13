/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'xgrid': {
          'black': '#000000',
          'white': '#FFFFFF',
          'gray': {
            'light': '#F5F5F5',
            'medium': '#E0E0E0',
            'dark': '#666666',
          },
          'blue': '#0066CC',
          'green': '#28A745',
          'red': '#DC3545',
        },
      },
      fontFamily: {
        'sans': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'xs': '14px',
        'sm': '14px',
        'base': '16px',
        'lg': '18px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '32px',
      },
      fontWeight: {
        'normal': 400,
        'semibold': 600,
      },
      borderRadius: {
        'xgrid': '4px',
      },
      boxShadow: {
        'xgrid': '0 2px 4px rgba(0,0,0,0.1)',
        'xgrid-hover': '0 4px 8px rgba(0,0,0,0.15)',
      },
      spacing: {
        'xgrid': '8px',
      },
    },
  },
  plugins: [],
}
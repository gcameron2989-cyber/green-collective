/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './ui/**/*.{js,ts,jsx,tsx,mdx}',
    './*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#071914',
        foreground: '#f8fafc',
        card: {
          DEFAULT: '#0a231b',
          foreground: '#f8fafc',
        },
        primary: {
          DEFAULT: '#10b981',
          foreground: '#071914',
        },
        secondary: {
          DEFAULT: '#0f382c',
          foreground: '#f8fafc',
        },
        muted: {
          DEFAULT: '#0f382c',
          foreground: '#6ee7b7',
        },
        border: 'rgba(16, 185, 129, 0.2)',
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Space Grotesk', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
        'display': ['Poppins', 'sans-serif'],
        'corporate': ['Inter', 'sans-serif'],
        'nature': ['Outfit', 'sans-serif'],
      },
      colors: {
        'electric-blue': '#0066FF',
        'neon-green': '#00FF88',
        'hot-pink': '#FF0080',
        'pure-black': '#000000',
        'pure-white': '#FFFFFF',
      },
      boxShadow: {
        'neubrutalism': '8px 8px 0px #0066FF',
        'neubrutalism-hover': '12px 12px 0px #0066FF',
        'neubrutalism-button': '4px 4px 0px #000000',
        'neubrutalism-button-hover': '6px 6px 0px #000000',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
        'scan': 'scan 2s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%': { boxShadow: '0 0 20px #0066FF' },
          '100%': { boxShadow: '0 0 40px #0066FF, 0 0 60px #00FF88' },
        },
        'scan': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.css",
  ],
  theme: {
    extend: {
      colors: {
        'theme-primary': 'rgb(var(--primary) / <alpha-value>)',
        'theme-primary-dim': 'rgb(var(--primary-dim) / <alpha-value>)',
        'theme-secondary': 'rgb(var(--secondary) / <alpha-value>)',
        'theme-accent': 'rgb(var(--accent) / <alpha-value>)',
        'theme-bg-start': 'rgb(var(--bg-start) / <alpha-value>)',
        'theme-bg-end': 'rgb(var(--bg-end) / <alpha-value>)',
        'theme-text': 'rgb(var(--text) / <alpha-value>)',
        'theme-text-muted': 'rgb(var(--text-muted) / <alpha-value>)',
        'theme-glow': 'rgb(var(--glow-color) / <alpha-value>)',
      },
      screens: {
        'xs': '320px',
        'sm': '375px',
        'ms': '390px',
        'ml': '414px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        'serif-alt': ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'heart-beat': 'heart-beat 1.5s ease-in-out infinite',
        'fade-up': 'fade-up 0.8s ease-out forwards',
        'scale-in': 'scale-in 0.6s ease-out forwards',
        'rotate-glow': 'rotate-glow 0.8s linear infinite',
        'film-grain': 'film-grain 0.15s infinite',
        'particle-drift': 'particle-drift 4s ease-out infinite',
        'typewriter-cursor': 'typewriter-cursor 1s step-end infinite',
        'shimmer-sweep': 'shimmer-sweep 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(var(--glow-color), 0.15)' },
          '50%': { boxShadow: '0 0 40px rgba(var(--glow-color), 0.35)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'heart-beat': {
          '0%, 100%': { transform: 'scale(1)' },
          '15%': { transform: 'scale(1.25)' },
          '30%': { transform: 'scale(1)' },
          '45%': { transform: 'scale(1.15)' },
          '60%': { transform: 'scale(1)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'rotate-glow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'film-grain': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-1px, 1px)' },
          '20%': { transform: 'translate(1px, -1px)' },
          '30%': { transform: 'translate(-1px, -1px)' },
          '40%': { transform: 'translate(1px, 1px)' },
          '50%': { transform: 'translate(0, 1px)' },
          '60%': { transform: 'translate(-1px, 0)' },
          '70%': { transform: 'translate(1px, 0)' },
          '80%': { transform: 'translate(0, -1px)' },
          '90%': { transform: 'translate(-1px, 0)' },
        },
        'particle-drift': {
          '0%': { opacity: '0', transform: 'translateY(0) scale(1)' },
          '20%': { opacity: '0.6' },
          '80%': { opacity: '0.3' },
          '100%': { opacity: '0', transform: 'translateY(-120px) scale(0.5)' },
        },
        'typewriter-cursor': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'shimmer-sweep': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      backdropBlur: {
        xs: '2px',
        glass: '16px',
        glasslg: '24px',
        glassxl: '32px',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
      borderRadius: {
        'glass': '20px',
        'glass-sm': '12px',
        'glass-lg': '28px',
        'glass-xl': '36px',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'glass-lg': '0 24px 80px rgba(0, 0, 0, 0.4)',
        'glow': '0 0 30px rgba(var(--glow-color), 0.15)',
        'glow-lg': '0 0 60px rgba(var(--glow-color), 0.25)',
        'inner-glow': 'inset 0 1px 0 rgba(var(--surface), 0.1)',
      },
    },
  },
  plugins: [],
};

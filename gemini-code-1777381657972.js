/** @type {import('tailwindcss').Config} */
module.exports = {
  // Added ./app/ for modern Next.js compatibility
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom terminal colors for easier use (e.g., text-matrix-glow)
        matrix: {
          dark: '#050505',
          low: '#003B00',
          medium: '#008F11',
          bright: '#00FF41',
          glow: '#0DFF00',
        },
      },
      fontFamily: {
        // Ensure a consistent mono font across systems
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        // Adding a flicker effect for that old CRT monitor feel
        flicker: {
          '0%': { opacity: '0.97' },
          '5%': { opacity: '0.9' },
          '10%': { opacity: '0.97' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        flicker: 'flicker 0.15s infinite',
      },
    },
  },
  plugins: [],
};
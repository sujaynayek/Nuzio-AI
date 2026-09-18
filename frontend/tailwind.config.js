/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nuzio: {
          bg: '#0B0C10',
          card: '#13141B',
          'card-hover': '#181A24',
          subtle: '#1C1E2A',
          border: '#262838',
          'border-light': '#32354A',
          purple: '#7C3AED',
          indigo: '#6366F1',
          accent: '#8B5CF6',
          emerald: '#10B981',
          cyan: '#06B6D4',
          text: '#F1F5F9',
          muted: '#94A3B8',
          dim: '#64748B',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        serif: ['"Instrument Serif"', '"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'glow-purple': '0 0 25px -5px rgba(124, 58, 237, 0.45)',
        'glow-emerald': '0 0 20px -5px rgba(16, 185, 129, 0.4)',
        'card': '0 8px 30px rgba(0, 0, 0, 0.45)',
      },
      keyframes: {
        waveform: {
          '0%, 100%': { height: '6px' },
          '50%': { height: '24px' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.8, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.05)' },
        }
      },
      animation: {
        waveform: 'waveform 1.2s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};

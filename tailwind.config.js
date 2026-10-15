/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        campus: {
          bg: '#050816',
          surface: '#080D1C',
          elevated: '#0B1224',
          cyan: '#00F0FF',
          cyanSoft: '#22D3EE',
          violet: '#8B5CF6',
          blue: '#3B82F6',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'cyan-glow': '0 0 24px -4px rgba(0, 240, 255, 0.35)',
        'cyan-sm': '0 0 12px -2px rgba(0, 240, 255, 0.25)',
        'violet-glow': '0 0 24px -4px rgba(139, 92, 246, 0.35)',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.015) 100%)',
        'cyan-radial': 'radial-gradient(circle at center, rgba(0, 240, 255, 0.15) 0%, transparent 70%)',
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './privacy.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"Roboto Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        app: '#000000',
        surface: '#0d0d0d',
        text: '#ffffff',
        muted: '#9ca3af',
        dim: '#6b7280',
        neon: '#39ff14',
        taken: '#52525b',
        checking: '#4b5563',
      },
    },
  },
  plugins: [],
};

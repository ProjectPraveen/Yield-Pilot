/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#f7f8fa',
        surface: '#ffffff',
        surface2: '#f0f2f5',
        surface3: '#e8ecf1',
        border: '#e2e6ed',
        border2: '#cdd2db',
        accent: {
          DEFAULT: '#15a362',
          hover: '#0f8a52',
          dim: 'rgba(21,163,98,0.08)',
        },
        text: {
          DEFAULT: '#111827',
          2: '#4b5563',
          3: '#9ca3af',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      borderRadius: {
        sm: '7px',
        DEFAULT: '10px',
        lg: '14px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        md: '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
};

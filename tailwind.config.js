/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary theme colors
        'main': 'rgb(20, 241, 149)',
        'main-back': '#100F0F',
        'advance': '#0F3D3E',

        // Background colors
        'profile-card-bg': '#303134',
        'bg': '#303134',
        'profile-container-bg': '#1E1E1E',
        'dashboard-bg': '#303134',
        'second-dark': '#1c1b1b',
        'new-dark': '#1E1E1E',
        'mobile-client-card-bg': '#191a1f',

        // Card and surface colors
        'card': '#24262b',
        'bg-c': '#415c71',

        // Accent colors
        'p': 'rgb(255, 0, 111)',

        // Pure colors
        'black': '#000000',
        'white': '#ffffff',
      },
      fontFamily: {
        'primary': ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'theme': '0 3px 3px 0 #171717',
        'theme-2': '0 1.5px 1.5px 0 #302a2a',
        'mobile': '0 4px 6px 0 #171717, 0 -0px 6px 0 #0e0d0d',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
      },
    },
  },
  plugins: [],
};
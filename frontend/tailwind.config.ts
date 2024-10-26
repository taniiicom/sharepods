import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'wave-up': {
          '0%': {
            transform: 'translateY(0) translateX(0%) scaleX(1) rotate(0deg)',
          },
          '25%': {
            transform: 'translateY(-12.5%) translateX(-5%) scaleX(1.05) rotate( 90deg)',
          },
          '50%': {
            transform: 'translateY(-25%) translateX(0%) scaleX(1) rotate(180deg)',
          },
          '75%': {
            transform: 'translateY(-37.5%) translateX(5%) scaleX(0.95) rotate(270deg)',
          },
          '100%': {
            transform: 'translateY(-50%) translateX(0%) scaleX(1) rotate(360deg)',
          },
        },
        'wave-down': {
          '0%': {
            transform: 'translateY(-150%) translateX(0%) scaleX(1) rotate(0deg)',
          },
          '25%': {
            transform: 'translateY(-125%) translateX(5%) scaleX(0.95) rotate(90deg)',
          },
          '50%': {
            transform: 'translateY(-100%) translateX(0%) scaleX(1) rotate(180deg)',
          },
          '75%': {
            transform: 'translateY(-75%) translateX(-5%) scaleX(1.05) rotate(270deg)',
          },
          '100%': {
            transform: 'translateY(-50%) translateX(0%) scaleX(1) rotate(360deg)',
          },
        },
      },
      animation: {
        'wave-up': 'wave-up 8s linear forwards',
        'wave-down': 'wave-down 16s forwards linear',
      },
      boxShadow: {
        'custom': '0 4px 20px rgba(0, 0, 0, 0.2)',
      },
      backgroundImage: {
        'wave-gradient':
          'linear-gradient(80deg, #0093E9 0%, #80D0C7 50%, #fff 100%)',
      },
      borderRadius: {
        'wave': '40% 35% 30% 35% / 30% 40% 35% 40%',
      },
    },
  },
  variants: {
    extend: {
      animation: ['hover'],
    },
  },
  plugins: [],
};
export default config;

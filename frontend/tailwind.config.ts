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
          'from': { transform: 'translateY(0) rotate(0deg)' },
          'to': { transform: 'translateY(-50%) rotate(360deg)' },
        },
        'wave-down': {
          'from': { transform: 'translateY(-100%) rotate(0deg)' },
          'to': { transform: 'translateY(-50%) rotate(360deg)' },
        },
      },
      animation: {
        'wave-up': 'wave-up 8s linear forwards',
        'wave-down': 'wave-down 8s forwards linear',
      },
      boxShadow: {
        'custom': '0 4px 20px rgba(0, 0, 0, 0.2)',
      },
      backgroundImage: {
        'wave-gradient': 'linear-gradient(80deg, #0093E9 0%, #80D0C7 50%, #fff 100%)',
      },
      borderRadius: {
        'wave': '30% 30% / 50% 50%',
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

import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        coral: {
          50: 'rgb(255, 241, 240)',
          100: 'rgb(255, 228, 225)',
          200: 'rgb(255, 201, 194)',
          300: 'rgb(255, 164, 153)',
          400: 'rgb(255, 114, 100)',
          500: 'rgb(255, 59, 40)',
          600: 'rgb(237, 28, 8)',
          700: 'rgb(197, 21, 5)',
          800: 'rgb(163, 21, 9)',
          900: 'rgb(134, 22, 15)',
        },
        teal: {
          50: 'rgb(240, 253, 250)',
          100: 'rgb(204, 251, 241)',
          200: 'rgb(153, 246, 228)',
          300: 'rgb(94, 234, 212)',
          400: 'rgb(45, 212, 191)',
          500: 'rgb(20, 184, 166)',
          600: 'rgb(13, 148, 136)',
          700: 'rgb(15, 118, 110)',
          800: 'rgb(17, 94, 89)',
          900: 'rgb(19, 78, 74)',
        },
      },
      button: {
        DEFAULT: {
          backgroundColor: 'var(--coral-500)',
          color: 'white',
          '&:hover': {
            backgroundColor: 'var(--teal-600)',
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

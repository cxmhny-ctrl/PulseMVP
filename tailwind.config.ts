import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        warm: {
          paper: "#FBF8F0",
          cream: "#FEFCF8",
        },
        charcoal: {
          900: "#2D2B28",
          700: "#6B6864",
          500: "#9B9894",
          300: "#C4C1BD",
          100: "#EBE8E4",
        },
        sage: {
          DEFAULT: "#4A9B7F",
          light: "#E8F5EF",
          hover: "#5DAB91",
        },
        amber: {
          DEFAULT: "#D48C4A",
          light: "#FBF0E0",
          hover: "#DDA062",
        },
        coral: {
          DEFAULT: "#D4695E",
          light: "#FAE7E5",
          hover: "#DD7F76",
        },
        calm: {
          DEFAULT: "#5A8DB4",
          light: "#E8F1F7",
          hover: "#6E9DC0",
        },
        depth: {
          DEFAULT: "#3A3532",
          surface: "#423D39",
          border: "#5C5651",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        breathe: "breathe 3s ease-in-out infinite",
        "pulse-ring": "pulseRing 2.5s cubic-bezier(0.32, 0.72, 0, 1) infinite",
        glow: "glow 4s ease-in-out infinite",
        enter: "enter 0.6s cubic-bezier(0.32, 0.72, 0, 1) both",
        "orb-outer": "orbOuter 6s linear infinite",
        "orb-inner": "orbInner 4s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        breathe: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.8)", opacity: "0.5" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
        glow: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.6" },
        },
        enter: {
          "0%": { opacity: "0", transform: "translateY(12px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        orbOuter: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        orbInner: {
          "0%": { transform: "scale(0.85)", opacity: "0.4" },
          "100%": { transform: "scale(1.05)", opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

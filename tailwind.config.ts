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
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          DEFAULT: "var(--surface)",
          raised: "var(--surface-raised)",
        },
        border: {
          DEFAULT: "var(--border)",
          subtle: "var(--border-subtle)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          strong: "var(--muted-strong)",
        },
        "warm-paper": "#FBF8F0",
        "warm-cream": "#FEFCF8",
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
          muted: "rgba(74,155,127,0.12)",
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
        ink: "#2D2B28",
        depth: {
          DEFAULT: "#1A1815",
          surface: "#252220",
          border: "#3A3733",
          card: "rgba(255,255,255,0.04)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      animation: {
        "fade-in":   "fadeIn 0.45s ease-out both",
        "slide-up":  "slideUp 0.5s cubic-bezier(0.32,0.72,0,1) both",
        breathe:     "breathe 3.2s ease-in-out infinite",
        "pulse-ring":"pulseRing 2.6s cubic-bezier(0.32,0.72,0,1) infinite",
        glow:        "glow 4s ease-in-out infinite",
        enter:       "enter 0.55s cubic-bezier(0.32,0.72,0,1) both",
      },
      keyframes: {
        fadeIn:    { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp:   { from: { opacity: "0", transform: "translateY(10px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        breathe:   { "0%,100%": { opacity: "0.55", transform: "scale(0.95)" }, "50%": { opacity: "1", transform: "scale(1.05)" } },
        pulseRing: { "0%": { transform: "scale(0.85)", opacity: "0.55" }, "100%": { transform: "scale(2.4)", opacity: "0" } },
        glow:      { "0%,100%": { opacity: "0.25" }, "50%": { opacity: "0.5" } },
        enter:     { from: { opacity: "0", transform: "translateY(14px) scale(0.98)" }, to: { opacity: "1", transform: "translateY(0) scale(1)" } },
      },
    },
  },
  plugins: [],
};

export default config;

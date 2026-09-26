import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1.25rem", lg: "2rem" }, screens: { "2xl": "1320px" } },
    extend: {
      colors: {
        obsidian: "#121212",
        gold: { DEFAULT: "#C9A227", dark: "#8C6F12" },
        ivory: "#F7F4EF",
        warm: { DEFAULT: "#8A8378", dark: "#5E584F" },
        border: "#E6E0D6",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "var(--font-bengali)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "var(--font-bengali)", "system-ui", "sans-serif"],
      },
      letterSpacing: { luxe: "0.3em" },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
      },
      animation: { "accordion-down": "accordion-down 0.25s ease-out", "accordion-up": "accordion-up 0.25s ease-out" },
    },
  },
  plugins: [animate],
} satisfies Config;

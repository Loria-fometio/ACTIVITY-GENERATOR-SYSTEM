import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});

// Tailwind configuration
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        primaryDark: "var(--color-primary-dark)",
        lightGray: "var(--color-light-gray)",
        darkGray: "var(--color-dark-gray)",
        mutedGray: "var(--color-muted-gray)",
        borderGray: "var(--color-border-gray)",
        white: "var(--color-white)",
      },
      fontFamily: {
        sans: "var(--font-sans)",
      },
      borderRadius: {
        card: "var(--radius-card)",
        button: "var(--radius-button)",
      },
      spacing: {
        page: "var(--space-page)",
        card: "var(--space-card)",
        sectionGap: "var(--space-section-gap)",
      },
    },
  },
  plugins: [],
};

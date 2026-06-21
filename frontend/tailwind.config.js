/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#fff",
        surface: "#111827",
        foreground: "#fff",

        primary: "#34908B",
        primaryHover: "#6FBEB2",

        secondary: "#10B981",

        muted: "#6B7280",

        border: "#1F2937",

        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#fc3535",
      },
    },
  },
  plugins: [],
};
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: "#4F46E5",   // Indigo
          secondary: "#10B981", // Green
          accent: "#F59E0B",    // Amber
          danger: "#EF4444",    // Red
          dark: "#111827",      // Dark background
        },
      },
    },
    plugins: [],
  };
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0EA5E9", // Sky blue
        secondary: "#10B981", // Green/Teal
        accent: "#0F172A", // Navy
        "background-light": "#F8FAFC",
        "background-dark": "#0B1120",
        "surface-light": "#FFFFFF",
        "surface-dark": "#1E293B",
        "text-light": "#334155",
        "text-dark": "#E2E8F0",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: "0.75rem",
      },
    },
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F7F3EA",
        ink: "#1F2A3C",
        correction: "#C1442D",
        "correction-dark": "#9E3520",
        sage: "#7C9885",
        "warm-grey": "#8B8378",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

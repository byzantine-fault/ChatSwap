/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "gray-700": "rgb(64,65,78)",
        "gray-800": "rgba(52,53,65,1)",
        "gray-900": "rgb(32,33,35)",
      },
      width: {
        280: "280px",
      },
      backgroundImage: {
        "vert-dark-gradient":
          "linear-gradient(180deg, rgba(53, 55, 64, 0), #353740 58.85%)",
        "vert-purple-gradient":
          "linear-gradient(180deg, rgba(126, 34, 206, 0), #2e1065 95.85%)",
        "vert-rainbow-gradient": "url('/images/bg-bottom.png')",
        "bg-stars": "url('/images/stars.webp')",
      },
    },
  },
  plugins: [nextui()],
};

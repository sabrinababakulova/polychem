/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "grey-border": "#E8E8EA",
        "grey-box-shadow": "rgba(11, 130, 155, 0.16)",
        "grey-text": "#A3A4AB",
        "bg-slight-grey": "#FBFBFE",
        "main-purple": "#6F6CD9",
        "light-purple": "#8C89E1",
        "text-purple": "#5956AE",
        "pale-purple": "#F1F0FB",
        "pale-grey": "#F8F8FD",
        "dark-black": "#191B2E",
        "dark-green": "#0B829B",
        "light-green": "rgba(11, 130, 155, 0.40)",
        "dark-beige": "#C08346",
        "light-beige": "rgba(240, 164, 88, 0.40)",
        "link-water": "#E2E2F7",
        "light-blue-grey": "#C5C4F0",
        "dawn-pink": "#E9E9F9",
        "cold-purple": "#A9A7E8",
        "storm-grey": "#757682",
        "main-red": "#FF5A5A",
        "border-red": "#CC4848",
        "pale-yellow": "#F6C89B",
        "light-yellow": "#FCEDDE",
        "main-yellow": "#F0A458",
        "bright-green": "#4FEEC3",
        "brighter-green": "#A7F6E1",
        "blue-green": "#1CBB90",
        "blue-green-darker": "#158C6C",
      },
      boxShadow: {
        main: "0px 1px 6px 0px rgba(11, 130, 155, 0.16)",
        "avatar-menu": "0px 4px 4px 0px rgba(25, 27, 46, 0.04)",
        "open-state": "4px 0px 0px 0px #E2E2F7 inset",
        "open-state-border": "4px 0px 0px 0px #C5C4F0 inset",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "0.5" },
        },
        fadeOut: {
          "0%": { opacity: "1", transform: "translateY(0px)" },
          "100%": { opacity: "0", transform: "translateY(-30px)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-out",
        fadeOut: "fadeOut 0.3s ease-in",
      },
    },
  },
  plugins: [],
};

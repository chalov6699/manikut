import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        blush: "#F8E7EB",
        rosewood: "#7E4A53",
        cream: "#FFF9F6",
        cocoa: "#3E2C31"
      },
      boxShadow: {
        soft: "0 16px 40px rgba(62,44,49,0.08)"
      }
    }
  },
  plugins: []
};

export default config;

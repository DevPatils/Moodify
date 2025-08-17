import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // make sure this matches your project
  ],
  theme: {
    extend: {
      colors: {
        ebonyclay: "#25273A",
      },
    },
  },
  plugins: [],
};

export default config;

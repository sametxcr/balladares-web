import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: { racing: "#E10600", dark: "#0A0A0A", dark2: "#1A1A1A" },
      fontFamily: { racing: ["Bebas Neue","Montserrat","sans-serif"] }
    },
  },
  plugins: [],
};
export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface": "#fbf9f5",
        "surface-dim": "#dbdad6",
        "surface-bright": "#fbf9f5",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f5f3ef",
        "surface-container": "#efeeea",
        "surface-container-high": "#eae8e4",
        "surface-container-highest": "#e4e2de",
        "on-surface": "#1b1c1a",
        "on-surface-variant": "#4c4636",
        "inverse-surface": "#30312e",
        "inverse-on-surface": "#f2f0ed",
        "outline": "#7e7764",
        "outline-variant": "#cfc6b0",
        "surface-tint": "#715c00",
        "primary": "#715c00",
        "on-primary": "#ffffff",
        "primary-fixed": "#ffdf8e",
        "on-primary-fixed": "#231b00"
      }
    },
  },
  plugins: [],
};
export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        dermcare: {
          DEFAULT: "#0F9CD8",
          light: "#E6F6FC",
          dark: "#0A6FA0"
        }
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem"
      },
      boxShadow: {
        soft: "0 10px 40px rgba(15, 156, 216, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;

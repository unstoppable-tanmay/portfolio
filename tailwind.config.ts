import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        Poppins: ["Poppins", "sans-serif"],
        FiraCode: ["Fira Code", "monospace"],
      },
      perspective: {
        "2000": "2000px",
      },
      keyframes: {
        slideUp: {
          from: { transform: "translateY(20px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-3d")({ legacy: true })],
  corePlugins: {
    preflight: false, // Disable preflight to avoid conflicts in PDF
  },
};
export default config;

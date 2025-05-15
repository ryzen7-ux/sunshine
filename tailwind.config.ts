// import type { Config } from "tailwindcss";
import { heroui } from "@heroui/theme";

// const config: Config = {
//   content: [
//     "./pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./app/**/*.{js,ts,jsx,tsx,mdx}",
//     "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
//   ],
//   theme: {
//     extend: {
//       gridTemplateColumns: {
//         "13": "repeat(13, minmax(0, 1fr))"
//       },
//       colors: {
//         blue: {
//           400: "#2589FE",
//           500: "#0070F3",
//           600: "#2F6FEB"
//         }
//       }
//     },
//     darkMode: "class",
//     plugins: [heroui()],
//     keyframes: {
//       shimmer: {
//         "100%": {
//           transform: "translateX(100%)"
//         }
//       }
//     }
//   },
//   plugins: [require("@tailwindcss/forms")]
// };
// export default config;

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"]
      }
    }
  },
  darkMode: "class",
  plugins: [heroui()]
};

export default config;
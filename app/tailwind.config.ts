import type { Config } from "tailwindcss";

import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      layout: {
        disabledOpacity: "0.3", // opacity-[0.3]
        radius: {
          small: "2px", // rounded-small
          medium: "4px", // rounded-medium
          large: "6px", // rounded-large
        },
        borderWidth: {
          small: "1px", // border-small
          medium: "1px", // border-medium
          large: "2px", // border-large
        },
      },
      themes: {
        light: {},
        dark: {},
        "instructor":{
          extend: "light",
          colors: {
            background: "#eceeff",
            foreground: "#ffffff",
            primary: {
              50: "#ffffff",
              100: "#cdcbeb",
              200: "#a9aad8",
              300: "#888bc5",
              400: "#666cb3",
              500: "#4c5699",
              600: "#3a3f78",
              700: "#292a57",
              800: "#181737",
              900: "#050419",
              DEFAULT: "#4c5699",
              foreground: "#ffffff",
            },
            focus: "#F182F6",
          },
        },
        "student":{
          extend: "light",
          colors: {
            background: "#0D001A",
            foreground: "#ffffff",
            primary: {
              50: "#e1faf9",
              100: "#c6e8e4",
              200: "#a7d6d1",
              300: "#86c4bb",
              400: "#66b3a6",
              500: "#4c9989",
              600: "#39776f",
              700: "#265652",
              800: "#113334",
              900: "#001414",
              DEFAULT: "#265652",
              foreground: "#ffffff",
            },
            focus: "#F182F6",
          },
        },
      },
    }),
  ],
};

export default config;

// import type { Config } from "tailwindcss";

// const {nextui} = require("@nextui-org/react");
// const config: Config = {
//   content: [
//     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
//     "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       backgroundImage: {
//         "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
//         "gradient-conic":
//           "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
//       },
//     },
//   },
//   darkMode: "class",
//   plugins: [nextui()],
// };
// export default config;

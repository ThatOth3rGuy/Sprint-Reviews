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
        light: {
          layout : {},
          colors : {}
        },
        dark: {},
        instructor:{
          extend: "light",
          colors: {
            background: "#eceeff",
            foreground: "#ffffff",
            primary: {
              DEFAULT: "#4c5699",
            },
            secondary:{
              DEFAULT: "#468c98"
            },
            success: {
              DEFAULT: "#56b361",
            },
            warning: {
              DEFAULT: "#ff8552",
            },
            danger: {
              DEFAULT: "#92140c",
            },
            focus: "#F182F6",
          },
        },
        student:{
          extend: "light",
          colors: {
            background: "#0D001A",
            foreground: "#ffffff",
            primary: {
              DEFAULT: "#265652",
            },
            secondary:{
              DEFAULT: "#72a98f"
            },
            success: {
              DEFAULT: "#92cf97",
            },
            warning: {
              DEFAULT: "#f6d965",
            },
            danger: {
              DEFAULT: "#bd1e1e",
            },
            focus: "#F182F6",
          },
        },
      },
    }),
  ],
};

export default config;
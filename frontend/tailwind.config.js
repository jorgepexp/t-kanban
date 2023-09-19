import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // This is required by next-themes
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [nextui({
    layout: {
      fontSize: {
        tiny: '0.75rem',
        small: '0.875rem',
        medium: '1rem',
        large: '1.25rem'
      },
      lineHeight: {
        tiny: '0.75rem',
        small: '0.875rem',
        medium: '1rem',
        large: '1.25rem'
      },
      radius: {
        small: "8px",
        medium: "12px",
        large: "14px",
      },
      borderWidth: {
        small: '1px',
        medium: '2px',
        large: '3px'
      }
    }
  })],
}

export default config;
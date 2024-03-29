/** @type {import('tailwindcss').Config} */
// tailwind.config.js

export const content = [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
  "./components/**/*.{js,jsx,ts,tsx}"
];
export const theme = {
  extend: {},
  screens: {
    'xsm':'450px',
    'sm': '640px',
    'md': '768px',
    'lg': '1024px',
    'xl': '1280px',
    '2xl': '1536px',
  }
};
export const plugins = [];

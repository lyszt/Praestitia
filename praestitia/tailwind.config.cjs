const { fontFamily } = require("tailwindcss/defaultTheme")
 
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["variant", [".dark &", '[data-kb-theme="dark"] &']],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans]
      }
    }
  }
  // ...
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14201C",
        paper: "#F7F8F5",
        mist: "#F1F4F2",
        line: { DEFAULT: "#E2E8E4", strong: "#D5DDD8" },
        body: "#4A5853",
        muted: "#5D6B66",
        subtle: "#3B4A44",
        brand: { DEFAULT: "#1F7A5A", dark: "#155C43", soft: "#E3F1EA" },
        sun: { DEFAULT: "#F2B544", soft: "#FFF4DC", ink: "#7A5300" },
        danger: { DEFAULT: "#B42318", soft: "#FEF3F2" }
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        float: "0 30px 60px -30px rgba(20,32,28,0.25)",
        card: "0 20px 40px -32px rgba(20,32,28,0.35)"
      }
    }
  },
  plugins: []
}

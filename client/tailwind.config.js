/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      // Background images
      backgroundImage: {
        backgroundPage: "url('/path/to/your/image.jpg')",
      },
      // Font families
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      // Screen breakpoints
      screens: {
        xxsm: "375px",
        xsm: "420px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        xxl: "1440px",
        xxxl: "1728px",
      },
      // Colors
      colors: {
        primary: "#DB4444",
        button: "#000000",
        buttonHover: "#E07575",
        textColor: "#7D8184",
        textColor2: "#000000",
      },
      // Font sizes
      fontSize: {
        "custom-sm": ["14px", "20px"],
        "custom-base": ["15px", "22px"],
        "custom-lg": ["16px", "24px"],
        "custom-xs": ["0.75rem", "1rem"],
        "custom-xl": ["1.25rem", "1.75rem"],
        "custom-2xl": ["1.5rem", "2rem"],
        "custom-3xl": ["1.875rem", "2.25rem"],
        "custom-4xl": ["2.25rem", "2.5rem"],
      },
      // Line heights
      lineHeight: {
        "custom-20": "20px",
        "custom-24": "24px",
        "custom-30": "30px",
        "custom-40": "40px",
        "custom-56": "56px",
        "custom-80": "80px",
        "custom-112": "112px",
      },
      // Font weights
      fontWeight: {
        "custom-light": 300,
        "custom-regular": 400,
        "custom-medium": 500,
        "custom-semi-bold": 600,
        "custom-bold": 700,
      },
      // Border radius values
      borderRadius: {
        none: "0",
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
        custom: "12px", // Custom rounded value
      },
      // Box shadows
      boxShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
        DEFAULT: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
        md: "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)",
        "2xl": "0 25px 50px rgba(0, 0, 0, 0.25)",
        custom: "0 2px 4px rgba(0, 0, 0, 0.1)", // Custom shadow style
        inner: "inset 0 2px 4px rgba(0, 0, 0, 0.06)",
        none: "none",
      },
      // Border widths
      borderWidth: {
        DEFAULT: "1px",
        custom: "1px", // Custom border width
      },
      // Spacing scale (you can add more values if needed)
      spacing: {
        72: "18rem",
        84: "21rem",
        96: "24rem",
      },
      // Letter spacing
      letterSpacing: {
        tighter: "-0.05em",
        tight: "-0.025em",
        normal: "0",
        wide: "0.025em",
        wider: "0.05em",
        widest: "0.1em",
      },
      // Transition durations
      transitionDuration: {
        0: "0ms",
        200: "200ms",
        400: "400ms",
        600: "600ms",
      },
      // Transition timing functions
      transitionTimingFunction: {
        in: "cubic-bezier(0.4, 0, 1, 1)",
        out: "cubic-bezier(0, 0, 0.2, 1)",
        "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      // z-index values
      zIndex: {
        "-10": "-10",
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "100",
      },
      // Opacity values
      opacity: {
        10: "0.1",
        20: "0.2",
        30: "0.3",
        40: "0.4",
        50: "0.5",
        60: "0.6",
        70: "0.7",
        80: "0.8",
        90: "0.9",
      },
      // Animations
      animation: {
        spin: "spin 1s linear infinite",
        ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        bounce: "bounce 1s infinite",
      },
    },
  },
  plugins: [],
};

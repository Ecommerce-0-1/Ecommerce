/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      backgroundImage: {
        backgroundPage: "",
      },
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
      colors: {
        //$primary
        primary: "#64748b",
        // purple
        primary2: "#1B1525",
        // navy blue
        primary3: "#262659",
        // primary3: "#174047",
        primary4: "#FFFFFF",
        //buttons
        button: "#64748b",
        buttonHover: "#94a3b8",
        buttonFocus: "#94a3b8",
        // text
        textColor: "#241F5C",
        textColor2: "#4D497B",
        textColor3: "#75748B",
      },
      fontSize: {
        "custom-xs": "13px",
        // 13px / 16px
        "custom-sm": "14px",
        // 14px / 16px
        "custom-base": "15px",
        // 15px / 16px
        "custom-lg": "16px",
        // 16px / 16px
        "custom-xl": "18px",
        // 18px / 16px
        "custom-2xl": "20px",
        // 20px / 16px
        "custom-3xl": "24px",
        // 24px / 16px
        "custom-4xl": "28px",
        // 28px / 16px
        "custom-5xl": "40px",
        // 40px / 16px
        "custom-6xl": "48px",
        // 48px / 16px
        "custom-7xl": "64px",
        // 64px / 16px
        "custom-8xl": "96px",
        // 96px / 16px
      },
      lineHeight: {
        "custom-20": "20px",
        // 20px / 16px = 0.5
        "custom-24": "24px",
        // 24px / 16px = 0.625
        "custom-30": "30px",
        // 30px / 16px = 0.75
        "custom-40": "40px",
        // 40px / 16px = 1
        "custom-56": "56px",
        // 56px / 16px = 1.4
        "custom-80": "80px",
        // 80px / 16px = 2
        "custom-112": "112px",
        // 112px / 16px = 3.5
      },
      fontWeight: {
        "custom-semi-bold": 600,
        // Font weight for "semiBold" //font-semi-bold
        "custom-medium": 500,
        // Font weight for "medium" //font-medium
        "custom-regular": 400,
        // Font weight for "Regular" (Tailwind uses 400 as the default) //font-regular
      },
    },
  },
  plugins: ["tailwindcss"],
};

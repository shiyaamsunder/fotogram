const defaultTheme = require("tailwindcss/defaultTheme");
require("dotenv").config();
module.exports = {
	purge: {
		enabled: true,
		content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
	},
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				purple: {
					50: "#f9f5fd",
					100: "#f2ebfc",
					200: "#dfccf7",
					300: "#ccadf2",
					400: "#a670e8",
					500: "#8033de",
					600: "#732ec8",
					700: "#6026a7",
					800: "#4d1f85",
					900: "#3f196d",
				},
			},
			fontFamily: {
				sans: ["Inter", ...defaultTheme.fontFamily.sans],
			},
		},
	},
	variants: {
		extend: { opacity: ["disabled"] },
	},
	plugins: [],
};

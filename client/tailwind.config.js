module.exports = {
	purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {},
		fontFamily: {
			body: ["Lexend"],
		},
	},
	variants: {
		extend: { opacity: ["disabled"] },
	},
	plugins: [],
};

import React, { useState } from "react";

const Input = ({ type, size, style }) => {
	const [value, setvalue] = useState("");

	const handleChange = (event) => {
		setvalue(event.target.value);
	};
	let sizes = {
		lg: "h-10 w-full px-3 py-3 rounded-md",
		md: "h-8 w-3/4 px-3 py-3 rounded-md",
		sm: "h-8 w-1/2 px-3 py-3 rounded-md",
	};

	let styles = {
		primary:
			"border-2 border-purple-400 text-md font-semibold rounded-md focus:outline-none focus:border-purple-600",
		error:
			"border-2 border-red-400 text-md font-semibold rounded-md focus:outline-none focus:border-red-600",
	};

	const SIZES = ["lg", "md", "sm"];
	const STYLES = ["primary", "error"];

	let inputSize = SIZES.includes(size) ? sizes[size] : sizes.md;
	let inputStyle = STYLES.includes(style) ? styles[style] : styles.primary;
	return (
		<input
			className={`${inputSize} ${inputStyle}`}
			type={type}
			onChange={handleChange}
		/>
	);
};

export default Input;

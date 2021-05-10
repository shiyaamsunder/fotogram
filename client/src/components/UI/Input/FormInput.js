import React from "react";
import Input from "./Input";

const FormInput = (props) => {
	let {
		type,
		label,
		value,
		onChange,
		inputsize,
		inputstyle,
		defaultValue,
	} = props.formdata;
	return (
		<div className="flex flex-col mb-4">
			{label ? (
				<div className="text-sm text-gray-400 font-semibold">{label}</div>
			) : null}
			<Input
				type={type}
				value={value}
				onChange={onChange}
				inputsize={inputsize}
				inputstyle={inputstyle}
				{...props}
				{...props.formdata}
			/>
		</div>
	);
};

export default FormInput;

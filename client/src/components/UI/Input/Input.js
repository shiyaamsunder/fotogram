import React, { useState } from 'react';
import UploadPic from './UploadPic';

const Input = (props) => {
	let { type, inputsize, inputstyle, onChange, value } = props;
	let sizes = {
		lg: 'h-10 w-full px-3 py-3 rounded-md',
		md: 'h-8 w-3/4 px-3 py-3 rounded-md',
		sm: 'h-8 w-1/2 px-3 py-3 rounded-md',
	};
	let styles = {
		primary:
			'input border-2 border-purple-400  focus:border-purple-600 input-dark',
		error: 'border-2 border-red-400 focus:border-red-600',
	};

	const SIZES = ['lg', 'md', 'sm'];
	const STYLES = ['primary', 'error'];

	inputsize = SIZES.includes(inputsize) ? sizes[inputsize] : sizes.md;
	inputstyle = STYLES.includes(inputstyle)
		? styles[inputstyle]
		: styles.primary;
	return (
		<>
			{type === 'file' ? (
				<UploadPic name="picture" onChange={onChange} text={props.text} />
			) : (
				<input
					className={`${inputsize} ${inputstyle} my-2`}
					type={type}
					onChange={onChange}
					value={value}
					{...props}
				/>
			)}
		</>
	);
};

export default Input;

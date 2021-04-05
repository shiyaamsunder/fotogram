import React from "react";

const Error = ({ message }) => {
	return (
		<div className="flex w-3/4 md:w-2/6 mt-3 mb-4 h-auto p-2 bg-red-100 rounded-md shadow-inner">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				className="w-6 text-red-400 mr-2"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
				/>
			</svg>
			<span className="text-red-400 font-2xl font-semibold">{message}</span>
		</div>
	);
};

export default Error;

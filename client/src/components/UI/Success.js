import React from "react";

const Success = ({ message }) => {
	return (
		<div className="flex w-3/4 md:w-2/6 h-auto p-2 mt-3 bg-green-100 mb-4 rounded-md shadow-inner">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				className="w-6 text-green-400 mr-2"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M5 13l4 4L19 7"
				/>
			</svg>

			<span className="text-green-400 font-2xl font-semibold">{message}</span>
		</div>
	);
};

export default Success;

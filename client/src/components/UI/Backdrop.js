import React from "react";

const Backdrop = ({ toggle }) => {
	return (
		<div
			className="w-full h-screen bg-black opacity-25 fixed top-0 left-0"
			onClick={toggle}
		></div>
	);
};

export default Backdrop;

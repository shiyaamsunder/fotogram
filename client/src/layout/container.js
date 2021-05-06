const container = ({ children, ...rest }) => {
	return (
		<div
			{...rest}
			className="flex flex-col items-center w-full h-auto bg-white rounded-lg p-4"
		>
			{children}
		</div>
	);
};

export default container;

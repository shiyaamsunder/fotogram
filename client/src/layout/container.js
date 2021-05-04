const container = ({ children, ...rest }) => {
	return (
		<div
			{...rest}
			className="flex flex-col w-full md:w-1/2 h-auto bg-white rounded-lg p-4"
		>
			{children}
		</div>
	);
};

export default container;

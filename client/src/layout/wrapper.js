const wrapper = ({ children, ...restprops }) => {
	return (
		<div {...restprops} className="bg-white dark:bg-dark h-screen">
			{children}
		</div>
	);
};

export default wrapper;

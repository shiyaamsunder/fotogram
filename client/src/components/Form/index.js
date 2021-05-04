import { Link } from 'react-router-dom';

export default function Form({ children, ...restProps }) {
	return (
		<div className="flex flex-col w-full items-center justify-around">
			{children}
		</div>
	);
}
Form.Title = function formTitle({ children, ...restProps }) {
	return (
		<h1 className="text-4xl font-bold text-gray-700 mt-2" {...restProps}>
			{children}
		</h1>
	);
};

Form.Base = function formBase({ children, ...restProps }) {
	return (
		<form
			method="POST"
			className="flex flex-col w-3/4 md:w-2/6 h-auto bg-white rounded-lg p-4 shadow-lg"
			{...restProps}
		>
			{children}
		</form>
	);
};

Form.Group = function formGroup({ children, ...restProps }) {
	return (
		<div className="flex flex-col h-auto mt-5 mb-1" {...restProps}>
			{children}
		</div>
	);
};
Form.Input = function formInput({ ...restProps }) {
	return (
		<input
			{...restProps}
			className=" h-10 w-full px-3 py-3 rounded-md input border-2 border-purple-400  focus:border-purple-600 text-gray-700"
		/>
	);
};

Form.Submit = function formSubmit({ children, ...restProps }) {
	return (
		<button className="btn btn-primary btn-md mt-2 h-auto" {...restProps}>
			{children}
		</button>
	);
};

Form.Bottom = function formBottom({ children, ...restProps }) {
	return (
		<div className="flex text-gray-500 mt-4" {...restProps}>
			{children}
		</div>
	);
};

Form.Link = function formLink({ children, ...restProps }) {
	return (
		<span className="ml-2 text-purple-500 font-semibold">
			<Link {...restProps}>{children}</Link>
		</span>
	);
};

import { HiOutlinePhotograph } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export default function Form({ children, ...restProps }) {
	return (
		<div
			className="flex flex-col w-full items-center justify-around"
			{...restProps}
		>
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
			className="flex flex-col w-full h-auto bg-white rounded-lg p-4 shadow-lg"
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

Form.Label = function formLabel({ children, ...restProps }) {
	return (
		<label className="text-sm text-gray-400 font-semibold" {...restProps}>
			{children}
		</label>
	);
};

Form.Input = function formInput({ size = 'lg', ...restProps }) {
	let sizes = {
		lg: 'h-10 w-full px-3 py-3 rounded-md',
		md: 'h-8 w-3/4 px-3 py-3 rounded-md',
		sm: 'h-8 w-1/2 px-3 py-3 rounded-md',
	};
	const SIZES = ['lg', 'md', 'sm'];

	size = SIZES.includes(size) ? sizes[size] : sizes.md;
	return (
		<input
			{...restProps}
			className={`${size} input border-2 border-purple-400  focus:border-purple-600 text-gray-700`}
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

Form.PicUpload = function formPicUpload({ children, ...restProps }) {
	return (
		<div
			className={`btn tracking-wide w-full mx-auto h-auto p-2 border text-gray-500`}
		>
			<label
				className="flex cursor-pointer items-center
    justify-between"
			>
				<span className="">{children}</span>
				<input
					type="file"
					className="hidden"
					accept="image/x-png,image/gif,image/jpeg"
					{...restProps}
				/>
				<HiOutlinePhotograph size={'1.5rem'} />
			</label>
		</div>
	);
};

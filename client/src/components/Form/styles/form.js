import { HiOutlinePhotograph } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export const Container = ({ children, ...restProps }) => {
	return (
		<div
			className="flex flex-col w-full md:w-2/6  items-center justify-around  p-5"
			{...restProps}
		>
			{children}
		</div>
	);
};

export const Title = ({ children, ...restProps }) => {
	return (
		<h1
			className="text-4xl font-bold text-gray-700 mt-2 dark:text-gray-50"
			{...restProps}
		>
			{children}
		</h1>
	);
};
export const Base = ({ children, ...restProps }) => {
	return (
		<form
			method="POST"
			className="flex flex-col w-full h-auto rounded-lg p-4 shadow-lg dark:bg-dark-50 dark:shadow-md-dark"
			{...restProps}
		>
			{children}
		</form>
	);
};
export const Group = ({ children, ...restProps }) => {
	return (
		<div className="flex flex-col h-auto mt-5 mb-1" {...restProps}>
			{children}
		</div>
	);
};
export const Label = ({ children, ...restProps }) => {
	return (
		<label className="text-sm text-gray-400 font-semibold" {...restProps}>
			{children}
		</label>
	);
};

export const Input = ({ size = 'lg', ...restProps }) => {
	let sizes = {
		lg: 'h-12 w-full px-3 py-3 rounded-md',
		md: 'h-10 w-3/4 px-3 py-3 rounded-md',
		sm: 'h-8 w-1/2 px-3 py-3 rounded-md',
	};
	const SIZES = ['lg', 'md', 'sm'];

	size = SIZES.includes(size) ? sizes[size] : sizes.md;
	return (
		<input
			{...restProps}
			className={`${size} input border-2 border-purple-primary  focus:border-purple-600 input-dark`}
		/>
	);
};
export const Submit = ({ children, ...restProps }) => {
	return (
		<button className="btn btn-primary btn-md mt-2 h-auto" {...restProps}>
			{children}
		</button>
	);
};
export const Bottom = ({ children, ...restProps }) => {
	return (
		<div className="flex text-gray-500 mt-4" {...restProps}>
			{children}
		</div>
	);
};
export const FormLink = ({ children, ...restProps }) => {
	return (
		<span className="ml-2 text-purple-500 font-semibold">
			<Link {...restProps}>{children}</Link>
		</span>
	);
};
export const PicUpload = ({ children, ...restProps }) => {
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

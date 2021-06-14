import { NavLink } from 'react-router-dom';

export const Container = ({ children, ...restProps }) => {
	return (
		<header
			className="flex items-center fixed bottom-0 bg-gray-200  md:top-0 w-full h-14 py-2 px-4  z-10 dark:bg-dark-100 dark:shadow-md-dark"
			{...restProps}
		>
			{children}
		</header>
	);
};

export const Title = ({ children, ...restProps }) => {
	return (
		<h1
			className="hidden md:flex flex-grow text-3xl font-sans text-purple-primary dark:text-purple-variant font-semibold"
			{...restProps}
		>
			{children}
		</h1>
	);
};

export const LinksContainer = ({ children, ...restProps }) => {
	return (
		<nav
			className=" w-full md:w-64 flex items-center justify-around"
			{...restProps}
		>
			{children}
		</nav>
	);
};

export const Link = ({ hidden = false, children, ...restProps }) => {
	const hiddenClass = hidden ? 'hidden md:block' : '';
	return (
		<NavLink className={hiddenClass} {...restProps}>
			{children}
		</NavLink>
	);
};

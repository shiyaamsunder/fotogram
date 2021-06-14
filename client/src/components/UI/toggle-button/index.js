import useDarkMode from '../../../hooks/use-dark-mode';

export default function Toggle({ ...restProps }) {
	const [colorTheme, setTheme] = useDarkMode();
	// const toggleIsDark = () => {
	// 	setIsDark(!isDark);
	// };

	const toggleSwatch = colorTheme === 'light' ? 'translate-x-4' : '';
	const toggleBg = colorTheme === 'light' ? 'bg-dark-25' : 'bg-white';
	return (
		<div
			onClick={() => setTheme(colorTheme)}
			className={`w-10 h-6 p-1 rounded-2xl  cursor-pointer ${toggleBg}`}
			{...restProps}
		>
			<div
				className={`w-4 h-4 bg-purple-primary rounded-full transition duration-200 transform ${toggleSwatch}`}
			></div>
		</div>
	);
}

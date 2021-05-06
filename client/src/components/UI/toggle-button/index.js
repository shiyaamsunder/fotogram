import { useState } from 'react';
import useDarkMode from '../../../hooks/use-dark-mode';

export default function Toggle({ ...restProps }) {
	const [isDark, setIsDark] = useState(false);
	const [colorTheme, setTheme] = useDarkMode();
	// const toggleIsDark = () => {
	// 	setIsDark(!isDark);
	// };

	const toggleClass = colorTheme === 'light' ? 'translate-x-4' : '';
	return (
		<div
			onClick={() => setTheme(colorTheme)}
			className="w-10 h-6 p-1 bg-white rounded-2xl  cursor-pointer"
			{...restProps}
		>
			<div
				className={`w-4 h-4 bg-purple-primary rounded-full transition duration-200 transform ${toggleClass}`}
			></div>
		</div>
	);
}

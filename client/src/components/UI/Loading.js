import React from 'react';
import { Ripple } from 'react-css-spinners';

const Loading = () => {
	return (
		<div className="flex flex-col w-1/2 mx-auto p-5 items-center justify-center">
			<Ripple color={'#8b5cf6'} />
			<h1 className="text-2xl font-bold text-purple-500">Loading...</h1>
		</div>
	);
};

export default Loading;

import React from "react";

const FeedModalHeader = ({ image, username }) => {
	const initialAvatar = `https://ui-avatars.com/api/?name=${username}&uppercase="false"?background=random`;
	return (
		<div className="w-full h-14 p-2 border-b border-gray-200 flex items-center">
			<img
				src={image || initialAvatar}
				alt="profile"
				className="w-10 h-10 object-contain rounded-full mr-2"
			/>
			<h3 className="text-sm font-bold text-purple-400">{username}</h3>
		</div>
	);
};

export default FeedModalHeader;

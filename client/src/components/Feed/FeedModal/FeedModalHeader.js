import React, { useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import FeedMenu from "../FeedMenu";

const FeedModalHeader = ({ image, username, feed_id }) => {
	const [isFeedMenuOpen, setIsFeedMenuOpen] = useState(false);

	const initialAvatar = `https://ui-avatars.com/api/?name=${username}&uppercase="false"?background=random`;
	return (
		<div className="w-full h-14 p-2 border-b border-gray-200 flex items-center justify-between">
			<div className="flex items-center">
				<img
					src={image || initialAvatar}
					alt="profile"
					className="w-10 h-10 object-contain rounded-full mr-2"
				/>
				<h3 className="text-sm font-bold text-purple-400">{username}</h3>
			</div>
			<div
				onClick={() => {
					setIsFeedMenuOpen(!isFeedMenuOpen);
				}}
				className="w-6 h-6 rounded-full hover:bg-gray-300  cursor-pointer mr-2 flex items-center justify-center"
			>
				<HiDotsVertical color={"gray"} />
			</div>

			{isFeedMenuOpen ? (
				<FeedMenu
					items={[{ name: "Delete" }]}
					toggle={() => {
						setIsFeedMenuOpen(!isFeedMenuOpen);
					}}
					id={feed_id}
				/>
			) : null}
		</div>
	);
};

export default FeedModalHeader;

import React from "react";
import { Link } from "react-router-dom";

const UserBar = ({ user, send_state = false, link_state }) => {
	if (!send_state) {
		link_state = {};
	}

	return (
		<div
			className="flex items-center border-b border-gray-200 justify-start h-auto p-3 "
			key={user._id}
		>
			<img
				src={
					user.profile_picture
						? user.profile_picture
						: `https://ui-avatars.com/api/?name=${user.username}`
				}
				alt=""
				className="w-10 h-10 rounded-full object-cover  cursor-pointer"
			/>
			<Link
				className="flex flex-col ml-5  cursor-pointer"
				to={{
					pathname: `/chat/${user.username}`,
					state: link_state,
				}}
			>
				<p className="font-bold text-sm text-purple-500">{user.username}</p>
				<h3 className="text-md text-gray-800">{user.name}</h3>
			</Link>
		</div>
	);
};

export default UserBar;

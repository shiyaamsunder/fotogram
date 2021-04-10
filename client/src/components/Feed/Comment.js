import React, { useState } from "react";
import { Link } from "react-router-dom";
// TODO calculate timestamp
const Comment = ({ comments }) => {
	let { comment, timestamp } = comments;
	let { username, profile_picture } = comments.user;

	const initialAvatar = `https://ui-avatars.com/api/?name=${username}&uppercase="false"?background=random`;
	return (
		<div className="p-1 border-b border-gray-200 w-full rounded flex items-center my-1">
			<img
				src={!profile_picture ? initialAvatar : profile_picture}
				alt="profile picture"
				className="rounded-full object-cover w-8 h-8 mr-1"
			/>
			<div className="flex flex-col items-start ml-1">
				<Link
					to={`/profile/${username}`}
					className="font-semibold text-xs text-purple-700"
				>
					{username}
				</Link>
				<span className="font-semibold text-sm">{comment}</span>
			</div>
			{/* <span>{timestamp}</span> */}
		</div>
	);
};

export default Comment;

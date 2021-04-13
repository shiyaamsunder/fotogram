import React from "react";
import { IoChatbubbleOutline, IoHeart, IoHeartOutline } from "react-icons/io5";
import CommentAction from "./CommentAction";

const FeedModalAction = ({ feed }) => {
	const { already_liked, likeCount, user, caption } = feed;
	return (
		<div className="flex flex-col items-start w-full mt-2 ml-2 justify-center max-h-40 ">
			<div className="flex">
				{already_liked ? (
					<IoHeart
						className="text-purple-500 hover:text-purple-400 cursor-pointer mr-2"
						size={"1.6rem"}
						// onClick={() => {
						// 	likePost(feed_id, current_user_id);
						// }}
					/>
				) : (
					<IoHeartOutline
						className="hover:text-purple-500 cursor-pointer mr-2"
						size={"1.6rem"}
						// onClick={() => {
						// 	likePost(feed_id, current_user_id);
						// }}
					/>
				)}
			</div>

			<span className="ml-1 font-semibold">
				{!likeCount
					? null
					: likeCount > 1
					? `${likeCount} likes`
					: `${likeCount} like`}
			</span>

			<div className="flex items-center ml-1">
				<span className="font-bold text-sm text-purple-500 mr-1">
					{user?.username}
				</span>
				<p className="text-sm ml-1">{caption}</p>
			</div>

			<CommentAction />
		</div>
	);
};

export default FeedModalAction;

import React from "react";
import FeedModalAction from "./FeedModalAction";
import FeedModalComments from "./FeedModalComments";
import FeedModalHeader from "./FeedModalHeader";

const RightPane = ({ user, comments, feed }) => {
	return (
		<div className="w-full md:w-1/2 flex flex-col  border-l border-gray-200">
			<div className="hidden md:flex">
				<FeedModalHeader
					image={user.profile_picture}
					username={user.username}
					feed_id={feed._id}
					className="hidden"
				/>
			</div>
			<FeedModalComments comments={comments} />
			<FeedModalAction feed={feed} />
		</div>
	);
};

export default RightPane;

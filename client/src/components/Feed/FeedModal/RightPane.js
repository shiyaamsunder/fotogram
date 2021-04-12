import React from "react";
import FeedModalAction from "./FeedModalAction";
import FeedModalComments from "./FeedModalComments";
import FeedModalHeader from "./FeedModalHeader";

const RightPane = ({ user, comments, feed }) => {
	return (
		<div className="w-1/2 flex flex-col  border-l border-gray-200">
			<FeedModalHeader image={user.profile_picture} username={user.username} />
			<FeedModalComments comments={comments} />
			<FeedModalAction feed={feed} />
		</div>
	);
};

export default RightPane;

import React from "react";
import Comment from "../Comment";

const FeedModalComments = ({ comments }) => {
	return (
		<div className="w-full max-h-48 mt-2 overflow-y-scroll">
			{comments.map((comment) => {
				return <Comment comments={comment} key={comment._id} />;
			})}
		</div>
	);
};

export default FeedModalComments;

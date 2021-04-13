import React from "react";
import Comment from "../Comment";

const FeedModalComments = ({ comments }) => {
	return (
		<div className="w-full h-40 max-h-48 mt-2 overflow-y-scroll flex">
			{comments.length > 0 ? (
				comments.map((comment) => {
					return <Comment comments={comment} key={comment._id} />;
				})
			) : (
				<span className="text-center text-sm font-semibold h-auto p-1 w-3/4 rounded-md mx-auto border border-gray-200">
					Wow, so empty
				</span>
			)}
		</div>
	);
};

export default FeedModalComments;

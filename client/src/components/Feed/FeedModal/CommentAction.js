import React from "react";
import Input from "../../UI/Input/Input";

const CommentAction = () => {
	return (
		<div className="h-20 w-full flex items-center justify-evenly">
			<Input type="text" size="md" style="primary" />
			<button className="btn btn-primary p-1 w-18">Post</button>
		</div>
	);
};

export default CommentAction;

import React from 'react';
import Comment from '../comment';
import moment from 'moment';

const CommentItem = ({ comments }) => {
	let { comment, timestamp } = comments;
	let { username, profile_picture } = comments.user;
	timestamp = moment(timestamp).fromNow();

	return (
		<Comment>
			<Comment.ProfilePicture
				profile_picture={profile_picture}
				username={username}
			/>
			<Comment.Content>
				<Comment.User to={`/profile/${username}`}>{username}</Comment.User>
				<Comment.Text>{comment}</Comment.Text>
			</Comment.Content>
			<Comment.TimeStamp>{timestamp}</Comment.TimeStamp>
		</Comment>
	);
};

export default CommentItem;

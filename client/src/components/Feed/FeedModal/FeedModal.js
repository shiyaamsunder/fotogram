import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Comment from "../Comment";
import { BASE_URL, FETCH_COMMENTS, COMMENT, LIKE } from "../../../config/urls";
import {
	IoChatbubbleOutline,
	IoHeart,
	IoHeartOutline,
	IoClose,
} from "react-icons/io5";
import Context from "../../../store/Context";
import FeedModalHeader from "./FeedModalHeader";
import RightPane from "./RightPane";

const FeedModal = ({ id, user, currentUser_id, toggleModal }) => {
	const { profile_picture, username } = user;
	const [currentFeed, setcurrentFeed] = useState({});
	const [comments, setcomments] = useState([]);
	const [comment, setcomment] = useState("");
	const [isDisabled, setisdisabled] = useState(true);
	const { globalState, globalDispatch } = useContext(Context);
	let token = localStorage.getItem("authToken");
	const { feeds } = globalState;

	useEffect(() => {
		if (comment.length >= 1) {
			setisdisabled(false);
		} else {
			setisdisabled(true);
		}
	}, [comment]);

	useEffect(() => {
		const _feed = feeds.find((feed) => {
			return feed._id == id;
		});
		setcurrentFeed(_feed);
		fetchComments(id);
	}, []);

	const likePost = (feed_id, user_id) => {
		const _feeds = feeds.filter((feed) => {
			if (feed._id == feed_id) {
				if (feed.already_liked) {
					feed.likeCount -= 1;
				} else {
					feed.likeCount += 1;
				}
				feed.already_liked = !feed.already_liked;
			}
			return feeds;
		});
		globalDispatch({ type: "SET_FEEDS", payload: { feeds: _feeds } });

		fetch(LIKE, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				feed: feed_id,
				user: user_id,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				// fetchFeed(feed_id);
			});
	};
	const fetchComments = (id) => {
		fetch(FETCH_COMMENTS + id, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				setcomments(data);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const handleChange = (event) => {
		setcomment(event.target.value);
	};

	const postComment = (feed_id, user_id) => {
		fetch(COMMENT, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				feed: feed_id,
				user: user_id,
				comment: comment,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				fetchComments(feed_id);
				setcomment("");
			});
	};

	return (
		<div className="bg-white absolute top-40 left-1/2 transform -translate-x-1/2 w-3/4 max-h-96 rounded-md flex">
			<img src={currentFeed.picture} alt="" className="w-1/2 rounded-md m-3" />
			<RightPane user={user} comments={comments} feed={currentFeed} />
		</div>
	);
};

export default FeedModal;

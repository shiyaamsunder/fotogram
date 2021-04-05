import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Comment from "./Comment";
import { BASE_URL, FETCH_COMMENTS, COMMENT, LIKE } from "../../config/urls";
import { IoChatbubbleOutline, IoHeart, IoHeartOutline } from "react-icons/io5";
import Context from "../../store/Context";
const FeedModal = ({ id, user, currentUser_id, feed }) => {
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
		const _feed = feeds.filter((feed) => feed._id == id);
		setcurrentFeed(_feed[0]);
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
	const initialAvatar = `https://ui-avatars.com/api/?name=${username}&uppercase="false"?background=random`;
	return (
		<div className=" w-full h-auto md:w-3/4 mx-auto md:h-3/4  rounded-lg bg-white fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 grid grid-cols-2 gap-4">
			<div className="h-full w-full flex items-center justify-center pl-3 pt-3 pb-3 mx-auto">
				<img src={currentFeed.picture} className="w-full" alt="" />
			</div>

			<div className="border-l pt-2 border-gray-200 flex flex-col">
				<div className="flex items-center justify-start rounded-sm p-3 border-b border-gray-200 h-1/6">
					<img
						src={!profile_picture ? initialAvatar : profile_picture}
						alt="profile picture"
						className="rounded-full object-cover w-10 h-10 mr-1"
					/>
					<h3 className="text-lg font-semibold ml-1 text-purple-600">
						<Link className="" to={`/profile/${username}`}>
							{username}
						</Link>
					</h3>
				</div>

				<div className="flex-1">
					{comments.length == 0 ? (
						<h1>Wow, so empty</h1>
					) : (
						comments.map((comment) => {
							return <Comment comments={comment} key={comment._id} />;
						})
					)}
				</div>

				<div className="flex flex-col h-1/4 my-2 p-2 border-t border-gray-200">
					<div className="flex ">
						{currentFeed.already_liked ? (
							<IoHeart
								className="text-purple-500 hover:text-purple-400 cursor-pointer mr-2"
								size={"1.6rem"}
								onClick={() => {
									likePost(id, currentUser_id);
								}}
							/>
						) : (
							<IoHeartOutline
								className="hover:text-purple-500 cursor-pointer mr-2"
								size={"1.6rem"}
								onClick={() => {
									likePost(id, currentUser_id);
								}}
							/>
						)}
					</div>

					<span className="ml-1">
						{!currentFeed.likeCount
							? null
							: currentFeed.likeCount > 1
							? `${currentFeed.likeCount} likes`
							: `${currentFeed.likeCount} like`}
					</span>
					<p className="ml-1">
						{currentFeed.caption ? (
							<span className="font-bold text-md mr-1">{username}</span>
						) : null}

						{currentFeed.caption}
					</p>
				</div>

				<div className="p-1 mx-1 w-full flex items-center justify-evenly">
					<input
						type="text"
						className="input h-10 w-10/12"
						placeholder="Add a comment"
						value={comment}
						onChange={(event) => handleChange(event)}
					/>
					<button
						className="text-white bg-purple-600 text-sm p-1 rounded-md disabled:opacity-30"
						disabled={isDisabled}
						onClick={() => postComment(id, currentUser_id)}
					>
						Post
					</button>
				</div>
			</div>
		</div>
	);
};

export default FeedModal;

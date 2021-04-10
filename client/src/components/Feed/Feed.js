import React, { useContext, useEffect, useState } from "react";
import { IoChatbubbleOutline, IoHeartOutline, IoHeart } from "react-icons/io5";
import { Link } from "react-router-dom";
import TopBarProgress from "react-topbar-progress-indicator";
import { BASE_URL, LIKE, FETCH_COMMENTS, COMMENT } from "../../config/urls";
import Context from "../../store/Context";
import Loading from "../UI/Loading";
import Comment from "./Comment";

const Feed = ({
	feed,
	token,
	current_user_id,
	name,
	profile_picture,
	toggleModal,
}) => {
	const { caption, picture, likeCount, already_liked } = feed;
	const feed_id = feed._id;

	const { globalState, globalDispatch } = useContext(Context);

	const [isOpen, setIsOpen] = useState(false);
	const [comments, setcomments] = useState([]);
	const [comment, setcomment] = useState("");
	const [isDisabled, setisdisabled] = useState(true);
	const [isLoading, setisloading] = useState(false);
	const { feeds } = globalState;

	const likePost = (feed_id, user_id) => {
		const new_feeds = feeds.filter((feed) => {
			if (feed._id == feed_id) {
				if (already_liked) {
					feed.likeCount -= 1;
				} else {
					feed.likeCount += 1;
				}
				feed.already_liked = !feed.already_liked;
			}
			return feeds;
		});
		globalDispatch({ type: "SET_FEEDS", payload: { feeds: new_feeds } });

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
			.then((data) => {});
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

	const fetchComments = (id) => {
		setisloading(true);
		fetch(FETCH_COMMENTS + id, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				setcomments(data);
				setisloading(false);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const handleChange = (event) => {
		setcomment(event.target.value);
	};

	useEffect(() => {
		if (comment.length >= 1) {
			setisdisabled(false);
		} else {
			setisdisabled(true);
		}
	}, [comment]);

	const initialAvatar = `https://ui-avatars.com/api/?name=${name}&uppercase="false"?background=random`;

	return (
		<div className="w-full rounded-md border border-gray-200 my-5 md:w-96 h-auto py-2 md:rounded-lg">
			<div className="flex  items-center justify-start rounded-sm h-auto ml-2">
				<img
					src={!profile_picture ? initialAvatar : profile_picture}
					alt="profile picture"
					className="rounded-full object-cover w-10 h-10 mr-1"
				/>
				<h3 className="text-lg font-semibold h-full text-purple-600">
					<Link className="h-full py-4 px-2" to={`/profile/${name}`}>
						{name}
					</Link>
				</h3>
			</div>
			<div className="flex flex-col items-center mt-2 h-5/6 ">
				<img
					src={picture}
					alt=""
					className={"object-contain"}
					onClick={toggleModal}
				/>

				<div className="flex flex-col items-start w-full mt-2 ml-2 justify-center h-1/4 ">
					<div className="flex">
						{already_liked ? (
							<IoHeart
								className="text-purple-500 hover:text-purple-400 cursor-pointer mr-2"
								size={"1.6rem"}
								onClick={() => {
									likePost(feed_id, current_user_id);
								}}
							/>
						) : (
							<IoHeartOutline
								className="hover:text-purple-500 cursor-pointer mr-2"
								size={"1.6rem"}
								onClick={() => {
									likePost(feed_id, current_user_id);
								}}
							/>
						)}

						<IoChatbubbleOutline
							className="hover:text-purple-500 cursor-pointer"
							size={"1.5rem"}
							onClick={() => {
								setIsOpen(!isOpen);
								fetchComments(feed_id);
							}}
						/>
					</div>

					<span className="ml-1">
						{!likeCount
							? null
							: likeCount > 1
							? `${likeCount} likes`
							: `${likeCount} like`}
					</span>

					<p className="ml-1">
						{caption ? (
							<span className="font-bold text-md mr-1">{name}</span>
						) : null}

						{caption}
					</p>
				</div>

				<div className="flex flex-col items-center justify-center w-full mx-2 p-2">
					{isOpen && isLoading ? <TopBarProgress /> : null}
					{isOpen && comments.length == 0 ? (
						<span className="text-center text-sm font-semibold h-auto p-1 w-3/4 rounded-md mx-auto border border-gray-200">
							Wow, so empty
						</span>
					) : null}
					{isOpen ? (
						<>
							{comments.map((comment) => {
								return <Comment comments={comment} key={comment._id} />;
							})}
							<div className="p-1 mx-1 w-full flex items-center justify-between">
								<input
									type="text"
									className="input h-10 w-full mr-1"
									placeholder="Add a comment"
									value={comment}
									onChange={(event) => handleChange(event)}
								/>
								<button
									className="btn btn-primary btn-sm text-sm p-1 rounded-md "
									disabled={isDisabled}
									onClick={() => postComment(feed_id, current_user_id)}
								>
									Post
								</button>
							</div>
						</>
					) : null}
				</div>
			</div>
		</div>
	);
};

export default Feed;

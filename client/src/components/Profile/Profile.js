import { motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { BASE_URL, PROFILE, USER, FOLLOW, UNFOLLOW } from "../../config/urls";
import { Ripple } from "react-css-spinners";
import FeedModal from "../Feed/FeedModal";
import Backdrop from "../UI/Backdrop";
import Loading from "../UI/Loading";
import TopBarProgress from "react-topbar-progress-indicator";
import Context from "../../store/Context";

const Profile = () => {
	let params = useParams();
	const history = useHistory();
	const location = useLocation();
	let token = localStorage.getItem("authToken");
	const [followStatus, setFollowStatus] = useState("Follow");
	const [followLoading, setFollowLoading] = useState(false);
	const [profile, setprofile] = useState({
		feeds: [],
		followers: [],
		influencers: [],
	});
	const [user, setuser] = useState({
		username: "",
		profile_picture: "",
		id: null,
		account_type: "",
		bio: "",
	});
	const [currentUser, setCurrentUser] = useState({
		username: "",
		profile_picture: "",
		id: null,
		account_type: "",
		bio: "",
	});
	const [isLoading, setisloading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [currentFeed, setCurrentFeed] = useState({});
	let currentUser_id = localStorage.getItem("id");
	const { globalState, globalDispatch } = useContext(Context);

	// Loading bar config
	TopBarProgress.config({
		barColors: {
			0: "#8b5cf6",
			0.5: "#7c3aed",
			"1.0": "#a78bfa",
		},
		shadowBlur: 5,
	});

	const handleLogout = () => {
		localStorage.removeItem("authToken");
		localStorage.removeItem("user");
		history.replace("/login");
	};

	useEffect(() => {
		setisloading(true);
		window.scrollTo(0, 0);
		fetch(PROFILE + params.username, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				setuser({
					username: data.user.username,
					profile_picture: data.user.profile_picture,
					id: data.user._id,
					account_type: data.user.account_type,
					bio: data.user.bio,
				});

				globalDispatch({ type: "SET_FEEDS", payload: { feeds: data.feeds } });

				let accepted_followers = data.followers.filter((follower) => {
					return follower.status === 1;
				});

				let requested_followers = data.followers.filter((follower) => {
					return follower.status === 0;
				});

				data.accepted_followers = accepted_followers;
				data.requested_followers = requested_followers;
				setprofile(data);

				if (currentUser_id !== data.user._id) {
					let checkInAcceptedFollowers = data.accepted_followers.find((ele) => {
						return ele.status === 1 && ele.follower._id;
					});

					if (checkInAcceptedFollowers === undefined) {
						let checkInRequestedFollowers = data.requested_followers.find(
							(ele) => {
								return ele.status === 0 && ele.follower._id;
							}
						);
						if (checkInRequestedFollowers !== undefined) {
							setFollowStatus("Cancel request");
						} else {
							setFollowStatus("Follow");
						}
					} else {
						setFollowStatus("Unfollow");
					}
				}

				setisloading(false);
			})
			.catch((err) => {
				console.log(err);
				setisloading(false);
			});
	}, []);

	useEffect(() => {
		setisloading(true);
		fetch(`${USER}${currentUser_id}` + "/", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				setCurrentUser({
					username: data.username,
					profile_picture: data.profile_picture,
					id: data._id,
					account_type: data.account_type,
					bio: data.bio,
				});
				setisloading(false);
			});
	}, []);

	const redirectToEditProfile = () => {
		history.push("/edit");
	};

	const toggleModal = () => {
		setIsOpen(!isOpen);
	};

	const connectionAction = (influencer_id, user_id) => {
		if (followStatus === "Follow") {
			followUser(influencer_id, user_id);
		}

		if (followStatus === "Cancel request" || followStatus === "Unfollow") {
			unFollowUser(influencer_id, user_id);
		}
	};
	const followUser = (influencer_id, user_id) => {
		setFollowLoading(true);
		fetch(FOLLOW, {
			method: "POST",
			body: JSON.stringify({
				influencer: influencer_id,
				follower: user_id,
			}),
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				setFollowLoading(false);

				if (data.message === "Request Sent") {
					setFollowStatus("Cancel request");
				} else {
					setFollowStatus("Unfollow");
				}
			});
	};

	const unFollowUser = (influencer_id, user_id) => {
		let body = {
			influencer: influencer_id,
			follower: user_id,
		};
		setFollowLoading(true);
		fetch(UNFOLLOW, {
			method: "POST",
			body: JSON.stringify(body),
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				setFollowStatus("Follow");
				setFollowLoading(false);
			});
	};

	return !isLoading ? (
		<>
			<motion.div
				initial={{ x: "400px" }}
				animate={{ x: 0 }}
				exit={{ x: "100vw" }}
				className="w-full md:w-3/4 h-screen mt-14 mx-auto mb-16"
			>
				{followLoading ? <TopBarProgress /> : null}
				<div className="w-full bg-gray-100 h-auto p-2 mx-auto rounded-b-md">
					<div className="flex h-18 items-center justify-between">
						<img
							className="rounded-full object-cover w-20 h-20 "
							src={
								user.profile_picture === ""
									? `https://ui-avatars.com/api/?name=${user.username}`
									: user.profile_picture
							}
							alt=""
						/>

						<div className="flex w-full items-center justify-evenly">
							<div className="text-center">
								<h3>{profile.feeds.length}</h3>
								<span className="font-bold">Posts</span>
							</div>

							<div className="text-center">
								<h3>{profile.influencers.length}</h3>
								<span className="font-bold">Influencers</span>
							</div>

							<div className="text-center">
								<h3>{profile.accepted_followers?.length}</h3>
								<span className="font-bold">Followers</span>
							</div>
						</div>
					</div>

					<div className="flex items-center justify-between mt-2">
						<div className="flex flex-col">
							<span className="font-semibold">{user.username}</span>
							<span>{user.bio}</span>
						</div>
					</div>
				</div>
				{location.pathname.split("/")[2] === currentUser.username ? (
					<div className="w-full flex justify-evenly items-center py-3 bg-gray-100 rounded-md ">
						<button
							className="btn btn-md btn-primary w-full mx-2"
							onClick={redirectToEditProfile}
						>
							Edit profile
						</button>

						<button
							onClick={handleLogout}
							className="btn btn-md btn-primary w-full mx-2"
						>
							Logout
						</button>
					</div>
				) : (
					<div className="w-full flex justify-evenly items-center py-3 bg-gray-100 rounded-md ">
						<button
							className={`btn btn-md ${
								followStatus === "Unfollow" || followStatus === "Cancel request"
									? "btn-secondary"
									: "btn-primary"
							} w-full mx-2`}
							onClick={() => connectionAction(user.id, currentUser.id)}
						>
							{followStatus}
						</button>

						<button
							// onClick={handleLogout}
							className="btn btn-md btn-primary w-full mx-2"
						>
							Message
						</button>
					</div>
				)}

				{user.account_type === "private" && user.id !== currentUser_id ? (
					<h1 className="font-bold text-xl text-center">
						This account is private
					</h1>
				) : (
					<div className="w-full grid grid-cols-3 mx-auto gap-5 h-auto mt-1 ">
						{profile.feeds && profile.feeds.length > 0 ? (
							profile.feeds.map((feed) => {
								return (
									<img
										src={feed.picture}
										key={feed._id}
										alt=""
										className=" w-32 h-32 md:w-full md:h-48 object-cover cursor-pointer"
										onClick={() => {
											toggleModal();
											setCurrentFeed(feed);
										}}
									/>
								);
							})
						) : (
							<h1 className="text-center font-bold text-xl">No Posts</h1>
						)}
					</div>
				)}
			</motion.div>
			{isOpen ? <Backdrop toggle={toggleModal} /> : null}
			{isOpen ? (
				<FeedModal
					id={currentFeed._id}
					user={user}
					currentUser_id={currentUser_id}
				/>
			) : null}
		</>
	) : (
		<div className="mt-20">
			<TopBarProgress />
			<Loading />
		</div>
	);
};

export default Profile;

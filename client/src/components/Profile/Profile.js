import { motion } from 'framer-motion';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import { BASE_URL, PROFILE, USER, FOLLOW, UNFOLLOW } from '../../config/urls';
import { Ripple } from 'react-css-spinners';
import FeedModal from '../Feed/FeedModal/FeedModal';
import Backdrop from '../UI/Backdrop';
import Loading from '../UI/Loading';
import TopBarProgress from 'react-topbar-progress-indicator';
import Context from '../../store/Context';

const Profile = () => {
	let params = useParams();
	const history = useHistory();
	const location = useLocation();
	let token = localStorage.getItem('authToken');
	const [followStatus, setFollowStatus] = useState('Follow');
	const [followLoading, setFollowLoading] = useState(false);
	const [isFollowing, setIsFollowing] = useState(false);
	// const [profile, setprofile] = useState({
	// 	feeds: [],
	// 	followers: [],
	// 	influencers: [],
	// });
	const [user, setuser] = useState({
		username: '',
		profile_picture: '',
		id: null,
		account_type: '',
		bio: '',
	});
	const [loggedInUser, setloggedInUser] = useState({
		username: '',
		profile_picture: '',
		id: null,
		account_type: '',
		bio: '',
	});
	const [isLoading, setisloading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [currentFeed, setCurrentFeed] = useState({});
	let loggedInUser_id = localStorage.getItem('id');
	const { globalState, globalDispatch } = useContext(Context);
	const { profile } = globalState;

	// Loading bar config
	TopBarProgress.config({
		barColors: {
			0: '#8b5cf6',
			0.5: '#7c3aed',
			'1.0': '#a78bfa',
		},
		shadowBlur: 5,
	});

	const handleLogout = () => {
		localStorage.removeItem('authToken');
		localStorage.removeItem('user');
		history.replace('/login');
	};

	useEffect(() => {
		setisloading(true);
		window.scrollTo(0, 0);
		fetchProfileData();
		setisloading(false);
	}, []);

	useEffect(() => {
		setisloading(true);
		fetchProfileData();
		setisloading(false);
	}, [followStatus]);

	useEffect(() => {
		setisloading(true);
		fetch(`${USER}${loggedInUser_id}` + '/', {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				setloggedInUser({
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
		history.push('/edit');
	};

	const toggleModal = () => {
		setIsOpen(!isOpen);
	};

	const fetchProfileData = () => {
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

				globalDispatch({ type: 'SET_FEEDS', payload: { feeds: data.feeds } });

				let accepted_followers = data.followers.filter((follower) => {
					return follower.status === 1;
				});

				let requested_followers = data.followers.filter((follower) => {
					return follower.status === 0;
				});

				data.accepted_followers = accepted_followers;
				data.requested_followers = requested_followers;

				if (loggedInUser_id !== data.user._id) {
					let checkInAcceptedFollowers = data.accepted_followers.find((ele) => {
						return ele.status === 1 && ele.follower._id === loggedInUser_id;
					});

					if (checkInAcceptedFollowers === undefined) {
						let checkInRequestedFollowers = data.requested_followers.find(
							(ele) => {
								return ele.status === 0 && ele.follower._id;
							}
						);
						console.log(checkInRequestedFollowers);
						if (checkInRequestedFollowers !== undefined) {
							setFollowStatus('Cancel request');
							setIsFollowing(true);
						} else {
							setFollowStatus('Follow');
						}
					} else {
						setFollowStatus('Unfollow');
					}
				}

				globalDispatch({ type: 'SET_PROFILE', payload: { profile: data } });
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const connectionAction = (influencer_id, user_id) => {
		if (followStatus === 'Follow') {
			followUser(influencer_id, user_id);
		}

		if (followStatus === 'Cancel request' || followStatus === 'Unfollow') {
			unFollowUser(influencer_id, user_id);
		}
	};
	const followUser = (influencer_id, user_id) => {
		setFollowLoading(true);
		fetch(FOLLOW, {
			method: 'POST',
			body: JSON.stringify({
				influencer: influencer_id,
				follower: user_id,
			}),
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.message === 'Request Sent') {
					setFollowStatus('Cancel request');
					setFollowLoading(false);
				} else {
					setFollowStatus('Unfollow');
					setFollowLoading(false);
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
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		})
			.then((res) => res.json())
			.then((data) => {
				setFollowStatus('Follow');
				setFollowLoading(false);
			});
	};

	return !isLoading ? (
		<>
			<motion.div
				initial={{ x: '400px' }}
				animate={{ x: 0 }}
				exit={{ x: '100vw' }}
				className={`w-full md:w-3/4 h-full pt-14 mx-auto pb-16 ${
					isOpen ? 'overflow-hidden' : ''
				}`}
			>
				{followLoading ? <TopBarProgress /> : null}
				<div className="w-full bg-gray-100 h-auto p-2 mx-auto rounded-b-md dark:bg-dark-25 dark:text-white">
					<div className="flex h-18 items-center justify-between">
						<img
							className="rounded-full object-cover w-20 h-20 "
							src={
								user.profile_picture === ''
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
				{location.pathname.split('/')[2] === loggedInUser.username ? (
					<div className="w-full flex justify-evenly items-center py-3 bg-gray-100 rounded-md dark:bg-dark-25 dark:text-white ">
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
					<div className="w-full flex justify-evenly items-center py-3 bg-gray-100 rounded-md dark:bg-dark-25 dark:text-white ">
						<button
							className={`btn btn-md ${
								followStatus === 'Unfollow' || followStatus === 'Cancel request'
									? 'btn-secondary'
									: 'btn-primary'
							} w-full mx-2`}
							onClick={() => connectionAction(user.id, loggedInUser.id)}
						>
							{followStatus}
						</button>

						<Link
							to={{
								pathname: `/chat/${user.username}`,
								state: { user2: user.id },
							}}
							className="btn btn-md btn-primary w-full mx-2 flex items-center justify-center"
						>
							Message
						</Link>
					</div>
				)}
				{user.account_type === 'private' &&
				user.id !== loggedInUser_id &&
				isFollowing ? (
					<h1 className="font-bold text-xl text-center">
						This account is private
					</h1>
				) : (
					<div className="w-full grid grid-cols-3 mx-auto gap-5 h-auto mt-2 dark:text-white ">
						{profile.feeds && profile.feeds.length > 0 ? (
							profile.feeds.map((feed) => {
								return (
									<img
										src={feed.picture}
										key={feed._id}
										alt=""
										className=" w-32 h-32 md:w-full md:h-48 object-cover cursor-pointer rounded-md"
										onClick={() => {
											toggleModal();
											setCurrentFeed(feed);
										}}
									/>
								);
							})
						) : (
							<h1 className="col-span-3 text-center font-bold text-xl mt-5">
								No Posts
							</h1>
						)}
					</div>
				)}
			</motion.div>

			{/* Feature for another day */}
			{/* {isOpen ? <Backdrop toggle={toggleModal} /> : null}
			{isOpen ? (
				<FeedModal
					id={currentFeed._id}
					user={user}
					loggedInUser_id={loggedInUser_id}
					toggleModal={toggleModal}
				/>
			) : null} */}
		</>
	) : (
		<div className="mt-20">
			<TopBarProgress />
			<Loading />
		</div>
	);
};

export default Profile;

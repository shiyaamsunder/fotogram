import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import TopBarProgress from "react-topbar-progress-indicator";
import { RANDOM, USERS_ALL } from "../../config/urls";
import Context from "../../store/Context";
import FeedModal from "../Feed/FeedModal/FeedModal";
import Backdrop from "../UI/Backdrop";

const Search = () => {
	const [randomFeeds, setRandomFeeds] = useState();
	const [isOpen, setIsOpen] = useState(false);
	const [currentFeed, setCurrentFeed] = useState();
	const { globalDispatch } = useContext(Context);
	const [loading, setloading] = useState(false);
	const [users, setusers] = useState();
	const [searchValue, setSearchValue] = useState("");
	const [searchedUsers, setSearchedUsers] = useState();

	let token = localStorage.getItem("authToken");
	let user_id = localStorage.getItem("id");

	TopBarProgress.config({
		barColors: {
			0: "#8b5cf6",
			0.5: "#7c3aed",
			"1.0": "#a78bfa",
		},
		shadowBlur: 5,
	});

	useEffect(() => {
		setloading(true);
		fetch(RANDOM, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				setRandomFeeds(data.feeds);
				globalDispatch({
					type: "SET_RANDOM_FEEDS",
					payload: { random: data.feeds },
				});
				setloading(false);
			})
			.catch((err) => console.log(err));
	}, []);

	useEffect(() => {
		setloading(true);
		fetch(USERS_ALL, {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => res.json())
			.then((data) => {
				setusers(data);
				setloading(false);
			})
			.catch((err) => {
				console.log(err);
				setloading(false);
			});
	}, []);

	const toggleModal = () => {
		setIsOpen(!isOpen);
	};

	const handleChange = (e) => {
		let val = e.target.value;
		setSearchValue(val);

		if (val.length > 0) {
			let filteredUsers = users.filter((user) => {
				return (
					user.username.toLowerCase().includes(val.toLowerCase()) ||
					user.name.toLowerCase().includes(val.toLowerCase())
				);
			});
			setSearchedUsers(filteredUsers);
		} else {
			setSearchedUsers(undefined);
		}
	};

	return (
		<div className="mt-14 flex flex-col items-center ">
			{loading ? <TopBarProgress /> : null}
			<input
				type="text"
				className="input border-2 border-purple-500"
				value={searchValue}
				placeholder="Search for users"
				onChange={handleChange}
			/>
			<div className="w-1/2 bg-gray-200 rounded-lg">
				{searchedUsers && searchedUsers.length === 0 && (
					<h1 className="text-lg font-extrabold p-5 text-center">No Users</h1>
				)}
				{searchedUsers !== undefined &&
					searchedUsers.map((user) => {
						return (
							<div
								className="flex items-center justify-start h-auto p-3 "
								key={user._id}
							>
								<img
									src={
										user.profile_picture
											? user.profile_picture
											: `https://ui-avatars.com/api/?name=${user.username}`
									}
									alt=""
									className="w-10 h-10 rounded-full object-cover  cursor-pointer"
								/>
								<Link
									className="flex flex-col ml-5  cursor-pointer"
									to={`/profile/${user.username}`}
								>
									<p className="font-bold text-sm text-purple-500">
										{user.username}
									</p>
									<h3 className="text-md text-gray-800">{user.name}</h3>
								</Link>
							</div>
						);
					})}
			</div>
			<div className="w-full md:w-3/4 grid grid-cols-3 mx-auto gap-4 h-auto mt-20 ">
				{randomFeeds &&
					randomFeeds.map((feed) => {
						return (
							<img
								src={feed.picture}
								key={feed._id}
								alt=""
								className="w-32 h-32 md:w-3/4 mx-auto md:h-48 md object-cover cursor-pointer"
								onClick={() => {
									toggleModal();
									setCurrentFeed(feed);
								}}
							/>
						);
					})}
			</div>

			{/* {isOpen ? <Backdrop toggle={toggleModal} /> : null}
			{isOpen ? (
				<FeedModal
					id={currentFeed._id}
					user={currentFeed.user}
					currentUser_id={user_id}
					toggleModal={toggleModal}
				/>
			) : null} */}
		</div>
	);
};

export default Search;

import React, { useContext, useEffect, useState } from "react";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import {
	HiHome,
	HiOutlineHome,
	HiOutlineUserCircle,
	HiOutlineSearch,
	HiOutlineLogout,
	HiOutlineChat,
	HiOutlinePlus,
	HiOutlineArrowLeft,
} from "react-icons/hi";

import { FcOldTimeCamera } from "react-icons/fc";
import { BASE_URL, USER } from "../../config/urls";
import Context from "../../store/Context";

const NavBar = () => {
	const history = useHistory();
	const location = useLocation();
	const [username, setusername] = useState("");
	const id = localStorage.getItem("id");
	const token = localStorage.getItem("authToken");
	const { globalState, globalDispatch } = useContext(Context);
	const { user } = globalState;

	useEffect(() => {
		let mounted = true;
		fetch(USER + `${id}`, {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => res.json())
			.then((data) => {
				if (mounted) {
					setusername(data.username);
					globalDispatch({ type: "SET_USER", payload: { user: data } });
				}
			});

		return function cleanup() {
			mounted = false;
		};
	}, []);

	return (
		<>
			<div
				className={`flex fixed w-full top-0 items-center py-2 px-4 justify-between md:hidden h-14 border-b border-gray-200 bg-white`}
			>
				{location.pathname === "/create" ||
				location.pathname === "/chat" ||
				location.pathname === "/edit" ? (
					<NavLink to="/">
						<HiOutlineArrowLeft
							size={"1.5em"}
							className="text-gray-600 hover:text-purple-500"
						/>
					</NavLink>
				) : (
					<NavLink to="/create">
						<HiOutlinePlus
							size={"1.5em"}
							className="text-gray-600 hover:text-purple-500 "
						/>
					</NavLink>
				)}

				<h1 className={`font-semibold text-purple-700 text-2xl`}>
					{location.pathname === "/chat" ? "Messages" : "FotoGram"}
				</h1>

				<NavLink to="/chat">
					<HiOutlineChat
						size={"1.5em"}
						className={`text-gray-600 hover:text-purple-500 ${
							location.pathname === "/edit" || location.pathname === "/chat"
								? "hidden"
								: "block"
						}  `}
					/>
				</NavLink>
			</div>

			<header className="flex items-center fixed bottom-0 md:top-0 w-full h-14 py-2 px-4 shadow-sm bg-gray-200">
				<div className="hidden md:flex flex-grow text-3xl text-purple-400 font-semibold">
					Fotogram
				</div>

				<nav className="w-full md:w-64 ">
					<ul className="flex items-center justify-around">
						<NavLink to="/create" className="hidden md:block">
							<HiOutlinePlus size={"1.5em"} />
						</NavLink>
						<NavLink to="/" exact>
							<HiOutlineHome size={"1.5em"} />
						</NavLink>

						<NavLink to="/search">
							<HiOutlineSearch size={"1.4em"} />
						</NavLink>

						<NavLink to={`/profile/${user.username}`}>
							<HiOutlineUserCircle size={"1.5em"} />
						</NavLink>
					</ul>
				</nav>
			</header>
		</>
	);
};

export default NavBar;

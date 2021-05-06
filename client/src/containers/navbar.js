import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import {
	HiOutlineHome,
	HiOutlineUserCircle,
	HiOutlineSearch,
	HiOutlineChat,
	HiOutlinePlus,
	HiOutlineArrowLeft,
} from 'react-icons/hi';

import { USER } from '../config/urls';
import Context from '../store/Context';
import Toggle from '../components/UI/toggle-button';
import Header from '../components/header';

export default function Navbar() {
	const history = useHistory();
	const location = useLocation();
	const [username, setusername] = useState('');
	const id = localStorage.getItem('id');
	const token = localStorage.getItem('authToken');
	const { globalState, globalDispatch } = useContext(Context);
	const { user } = globalState;

	useEffect(() => {
		let mounted = true;
		fetch(USER + `${id}/`, {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => res.json())
			.then((data) => {
				if (mounted) {
					setusername(data.username);
					globalDispatch({ type: 'SET_USER', payload: { user: data } });
				}
			});

		return function cleanup() {
			mounted = false;
		};
	}, []);

	return (
		<>
			<div
				className={`flex fixed w-full top-0 items-center py-2 px-4 justify-between md:hidden h-14 border-b border-gray-200 bg-white z-10`}
			>
				{location.pathname === '/create' ||
				location.pathname.includes('chat') ||
				location.pathname === '/edit' ? (
					<button onClick={() => history.goBack()}>
						<HiOutlineArrowLeft
							size={'1.5em'}
							className="text-gray-600 hover:text-purple-500"
						/>
					</button>
				) : (
					<>
						<NavLink to="/create">
							<HiOutlinePlus
								size={'1.5em'}
								className="text-gray-600 hover:text-purple-500 "
							/>
						</NavLink>
					</>
				)}
				<h1 className={`font-semibold text-purple-700 text-xl`}>
					{location.pathname.includes('/chat/')
						? `@${location.pathname.split('/')[2]}`
						: location.pathname === '/chat'
						? 'Messages'
						: 'Fotogram'}
				</h1>
				<NavLink to="/chat">
					<HiOutlineChat
						size={'1.5em'}
						className={`text-gray-600 hover:text-purple-500 ${
							location.pathname === '/edit' ||
							location.pathname.includes('chat')
								? 'hidden'
								: 'block'
						}  `}
					/>
				</NavLink>
			</div>

			<Header>
				<Header.Title>Fotogram</Header.Title>
				<Header.LinksContainer>
					<Toggle />
					<Header.Link to="/create" hidden>
						<HiOutlinePlus size={'1.5em'} />
					</Header.Link>
					<Header.Link to="/home">
						<HiOutlineHome size={'1.5em'} />
					</Header.Link>
					<Header.Link to="/search">
						<HiOutlineSearch size={'1.5em'} />
					</Header.Link>
					<Header.Link to="/chat" hidden>
						<HiOutlineChat size={'1.5em'} />
					</Header.Link>
					<Header.Link to={`/profile/${user.username}`}>
						<HiOutlineUserCircle size={'1.5em'} />
					</Header.Link>
				</Header.LinksContainer>
			</Header>
		</>
	);
}

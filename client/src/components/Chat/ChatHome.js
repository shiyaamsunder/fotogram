import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CONVOS } from '../../config/urls';
import UserBar from '../UI/UserBar';

const ChatHome = () => {
	const [users, setusers] = useState();
	const id = localStorage.getItem('id');
	const token = localStorage.getItem('authToken');
	useEffect(() => {
		fetch(CONVOS + id, {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => res.json())
			.then((data) => {
				setusers(data);
			});
	}, []);

	return (
		<div className="mt-14 pt-5 w-full md:w-3/4 mx-auto h-full">
			<h1 className="hidden md:block text-2xl text-center text-purple-500 font-bold p-10">
				Messages
			</h1>

			{users !== undefined &&
				users.map((user) => {
					return (
						<UserBar
							user={user}
							send_state
							key={user._id}
							link_state={{ user2: user._id, name: user.username }}
						/>
					);
				})}
		</div>
	);
};

export default ChatHome;

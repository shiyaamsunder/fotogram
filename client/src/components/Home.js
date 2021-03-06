import { motion } from 'framer-motion';
import React, { useContext, useEffect, useState } from 'react';
import TopBarProgress from 'react-topbar-progress-indicator';

import { HOME } from '../config/urls';
import Feed from './Feed/Feed';
import Context from '../store/Context';
import Loading from './UI/Loading';
const Home = (props) => {
	const { globalState, globalDispatch } = useContext(Context);
	// const [feeds, setFeeds] = useState([]);

	let token = localStorage.getItem('authToken');
	let user_id = localStorage.getItem('id');
	const [isLoading, setisloading] = useState(false);
	const { feeds } = globalState;

	// Loading bar config
	TopBarProgress.config({
		barColors: {
			0: '#8b5cf6',
			0.5: '#7c3aed',
			'1.0': '#a78bfa',
		},
		shadowBlur: 5,
	});

	useEffect(() => {
		document.title = 'Fotogram';
		setisloading(true);
		let isSub = true;
		fetch(`${HOME}${user_id}/`, {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => res.json())
			.then((data) => {
				if (isSub) {
					globalDispatch({ type: 'SET_FEEDS', payload: { feeds: data } });

					// setFeeds(data);
					setisloading(false);
				}
			});
		return () => (isSub = false);
	}, []);

	return !isLoading ? (
		<motion.div className="flex flex-col h-auto pt-14 pb-14 items-center justify-center dark:bg-dark transition duration-150">
			<h1 className="text-3xl font-bold text-gray-600 dark:text-gray-200 my-5">
				Your Timeline
			</h1>
			{feeds &&
				feeds.map((feed, index) => (
					<Feed
						key={feed._id}
						feed={feed}
						name={feed.user.username}
						current_user_id={user_id}
						token={token}
						profile_picture={feed.user.profile_picture}
					/>
				))}
		</motion.div>
	) : (
		<div className="mt-20">
			<TopBarProgress />
			<Loading />
		</div>
	);
};

export default Home;

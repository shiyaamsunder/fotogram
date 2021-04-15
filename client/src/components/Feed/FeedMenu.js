import React, { useContext } from "react";
import { v4 as uuid } from "uuid";
import { DELETE_FEED } from "../../config/urls";
import Context from "../../store/Context";

const FeedMenu = ({ items, toggle, feed_id, user_id }) => {
	const token = localStorage.getItem("authToken");
	const { globalState, globalDispatch } = useContext(Context);
	const { feeds, user } = globalState;

	const feedMenuAction = (toggle, action, feed_id) => {
		if (action === "Delete") {
			deleteFeed(feed_id);
		}

		toggle();
	};

	const deleteFeed = (feed_id) => {
		let new_feeds = feeds.filter((feed) => {
			return feed._id !== feed_id;
		});
		globalDispatch({ type: "SET_FEEDS", payload: { feeds: new_feeds } });
		fetch(DELETE_FEED + `/${feed_id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
			})
			.catch((err) => {
				console.log(err);
			});
	};
	return (
		<div className="w-60 h-auto bg-white border border-gray-200 rounded-md ">
			{items.map((item) => {
				return (
					<p
						className="w-full p-2 border-b border-gray-200 hover:bg-gray-300 cursor-pointer rounded-md"
						onClick={() => {
							feedMenuAction(toggle, item.name, feed_id);
						}}
						key={uuid()}
					>
						{item.name}
					</p>
				);
			})}
		</div>
	);
};

export default FeedMenu;

import React, { useContext } from "react";
import { v4 as uuid } from "uuid";
import { DELETE_FEED } from "../../config/urls";
import Context from "../../store/Context";

const FeedMenu = ({ items, toggle, id }) => {
	const token = localStorage.getItem("authToken");
	const { globalState, globalDispatch } = useContext(Context);
	const { feeds } = globalState;
	const feedMenuAction = (toggle, action, id) => {
		if (action === "Delete") {
			deleteFeed(id);
		}

		toggle();
	};

	const deleteFeed = (id) => {
		let new_feeds = feeds.filter((feed) => {
			return feed._id !== id;
		});
		globalDispatch({ type: "SET_FEEDS", payload: { feeds: new_feeds } });
		fetch(DELETE_FEED + `/${id}`, {
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
		<div className="w-1/2 h-auto bg-white border border-gray-200 rounded-md absolute top-8 right-3">
			{items.map((item) => {
				return (
					<p
						className="w-full p-2 border-b border-gray-200 hover:bg-gray-300 cursor-pointer"
						onClick={() => {
							feedMenuAction(toggle, item.name, id);
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

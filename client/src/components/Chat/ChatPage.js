import React, { useEffect, useState } from "react";
import { GET_CONVO } from "../../config/urls";
import io from "socket.io-client";
import { v4 as uuid } from "uuid";

const ChatPage = ({ location }) => {
	let user1 = localStorage.getItem("id");
	let user2 = location.state.user2;
	const token = localStorage.getItem("authToken");

	const [chats, setChats] = useState([]);
	const [message, setmessage] = useState("");
	const [socket, setsocket] = useState();

	useEffect(() => {
		fetch(GET_CONVO + `${user1}/${user2}`, {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => res.json())
			.then((data) => {
				setChats(data);
			});

		const newSocket = io(
			`${
				process.env.REACT_APP_ENV === "production"
					? "https://blooming-garden-12714.herokuapp.com"
					: "http://localhost:8000"
			}`,
			{
				query: { id: user1 },
			}
		);
		newSocket.on("recieve", (chat) => {
			setChats((prev) => [...prev, chat]);
		});
		setsocket(newSocket);

		return () => newSocket.close();
	}, []);

	const handleChange = (event) => {
		setmessage(event.target.value);
	};

	const sendMessage = (message) => {
		socket.emit("send", {
			sender: user1,
			reciever: user2,
			message: message,
		});
		setChats((prev) => [
			...prev,
			{
				sender: user1,
				reciever: user2,
				message: message,
				_id: uuid(),
			},
		]);
		setmessage("");
	};

	return (
		<div className=" flex flex-col mt-0 justify-between w-full h-screen md:w-3/4 mx-auto overflow-y-auto py-14 md:pb-0 shadow-xl">
			<div className="w-auto p-1">
				{chats.map((chat) => {
					return (
						<p
							key={chat._id}
							className={`block rounded-2xl ${
								chat.sender === user1
									? "float-right rounded-br-none bg-purple-500 "
									: "float-left rounded-bl-none bg-white text-purple-500 border-2 border-purple-500"
							} clear-both font-semibold  shadow-md text-white p-3 w-auto h-auto m-1`}
							style={{ maxWidth: "75%", wordWrap: "break-word" }}
						>
							{chat.message}
						</p>
					);
				})}
			</div>
			{console.log(chats)}
			<div className="flex w-full p-3 items-center justify-evenly">
				<input
					type="text"
					placeholder="Type something..."
					className="input border-2 md:w-3/4 border-purple-500"
					value={message}
					onChange={(event) => handleChange(event)}
				/>
				<button
					onClick={() => sendMessage(message)}
					className="btn btn-primary rounded btn-sm flex items-center"
				>
					Send
				</button>
			</div>
		</div>
	);
};

export default ChatPage;

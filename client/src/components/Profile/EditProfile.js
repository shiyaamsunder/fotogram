import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import { HiOutlinePhotograph } from "react-icons/hi";
import { BASE_URL, USER, USER_UPDATE } from "../../config/urls";
import Error from "../UI/Error";
import Success from "../UI/Success";
import Context from "../../store/Context";

const EditProfile = () => {
	const [profile, setprofile] = useState({
		name: "",
		username: "",
		bio: "",
		profile_picture: "",
	});
	const history = useHistory();
	const [error, seterr] = useState("");
	const [success, setsuccess] = useState("");

	const { globalState, globalDispatch } = useContext(Context);
	const user = globalState.user;

	const [file, setfile] = useState();
	let editedProfile = new FormData();
	// editedProfile.append("user", localStorage.getItem("id"));

	let currentUser_id = localStorage.getItem("id");
	let token = localStorage.getItem("authToken");

	useEffect(() => {
		fetch(BASE_URL + USER + currentUser_id, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				setprofile({
					name: data.name,
					username: data.username,
					bio: data.bio,
					profile_picture: data.profile_picture,
					account_type: data.account_type,
				});
				globalDispatch({ type: "SET_USER", payload: { user: data } });
			});
	}, []);

	const handleChange = (event) => {
		let val = event.target.value;
		if (event.target.name === "picture") {
			setfile(URL.createObjectURL(event.target.files[0]));
			setprofile({
				...profile,
				profile_picture: event.target.files[0],
			});
		} else {
			setprofile({
				...profile,
				[event.target.name]: val,
			});
		}
	};

	const submitForm = () => {
		// setloading(true);
		editedProfile.append("username", profile.username);
		editedProfile.append("name", profile.name);
		editedProfile.append("bio", profile.bio);
		editedProfile.append("profile_picture", profile.profile_picture);
		editedProfile.append("account_type", profile.account_type);
		fetch(BASE_URL + USER_UPDATE + currentUser_id, {
			method: "PUT",
			body: editedProfile,
			headers: {
				Authorization: `Bearer ${localStorage.getItem("authToken")}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				seterr(null);
				setsuccess(null);
				if (data.status === "error") {
					seterr(data.message);
				}
				if (data.code === 1) {
					setsuccess(data.message);

					globalDispatch({
						type: "SET_USER",
						payload: {
							user: profile,
						},
					});
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<div className="flex flex-col items-center mt-16 p-8 mb-16 w-full md:w-1/2 mx-auto">
			{error ? <Error message={error} /> : null}
			{success ? <Success message={success} /> : null}
			<div className="flex flex-col items-center mb-3">
				{profile.profile_picture !== "" ? (
					<img
						src={!file ? profile.profile_picture : file}
						alt="profile picture"
						className="rounded-full object-cover w-28 h-28 mb-2"
					/>
				) : (
					<p className="rounded-full object-cover w-28 h-28 mb-2 text-center bg-purple-400 flex items-center justify-center">
						No profile picture
					</p>
				)}

				<div className="btn tracking-wide h-auto p-2 border text-gray-500">
					<label
						className="flex cursor-pointer items-center
                        justify-between"
					>
						<span className="">Change Profile Picture</span>
						<input
							type="file"
							className="hidden"
							placeholder="Choose a picture"
							name="picture"
							accept="image/jpeg"
							onChange={(event) => handleChange(event)}
						/>
						<HiOutlinePhotograph size={"1.5rem"} />
					</label>
				</div>
			</div>

			<div className="w-full">
				<div className="flex flex-col mb-4">
					<label htmlFor="username" className="text-sm text-gray-500 mb-1">
						Username
					</label>
					<input
						type="text"
						defaultValue={profile.username}
						className="input"
						onChange={(event) => handleChange(event)}
						name="username"
					/>
				</div>
				<div className="flex flex-col mb-4">
					<label htmlFor="name" className="text-sm text-gray-500 mb-1">
						Name
					</label>
					<input
						type="text"
						defaultValue={profile.name}
						className="input"
						onChange={(event) => handleChange(event)}
						name="name"
					/>
				</div>
				<div className="flex flex-col mb-4">
					<label htmlFor="bio" className="text-sm text-gray-500 mb-1">
						Bio
					</label>
					<input
						type="text"
						defaultValue={profile?.bio}
						className="input"
						maxLength={50}
						name="bio"
						onChange={(event) => handleChange(event)}
					/>
				</div>
			</div>

			<div className="flex flex-col mb-4 w-full">
				<label htmlFor="account_type" className="text-sm text-gray-500 mb-1">
					Account Privacy
				</label>
				<div className="flex justify-start items-center">
					<div className="mr-2">
						<input
							type="radio"
							// defaultValue={profile.name}
							value="private"
							checked={profile.account_type === "private"}
							className="input mr-1"
							onChange={(event) => handleChange(event)}
							name="account_type"
						/>
						<span className="text-sm ml-1">Private</span>
					</div>

					<div className="ml-2">
						<input
							type="radio"
							// defaultValue={profile.name}
							value="public"
							checked={profile.account_type === "public"}
							className="input mr-1"
							onChange={(event) => handleChange(event)}
							name="account_type"
						/>
						<span className="text-sm ml-1">Public</span>
					</div>
				</div>
			</div>
			<button
				onClick={submitForm}
				className="btn bg-purple-600 text-gray-100 w-2/6 md:w-40 mx-2 mt-6"
			>
				Save Changes
			</button>
		</div>
	);
};

export default EditProfile;
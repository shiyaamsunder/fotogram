import React, { useEffect, useState } from "react";
import { Ripple } from "react-css-spinners";
import { HiOutlinePhotograph } from "react-icons/hi";
import { useHistory } from "react-router-dom";
import Error from "../UI/Error";
import Success from "../UI/Success";

import { motion } from "framer-motion";
import TopBarProgress from "react-topbar-progress-indicator";

const CreateFeed = (props) => {
	const [state, setstate] = useState({
		caption: "",
		picture: "",
		hashtags: "",
		tags: "",
		location: "",
		user: "",
	});

	// Loading bar config
	TopBarProgress.config({
		barColors: {
			0: "#8b5cf6",
			0.5: "#7c3aed",
			"1.0": "#a78bfa",
		},
		shadowBlur: 5,
	});

	const [file, setfile] = useState();

	useEffect(() => {
		window.scrollTo(0, 0);
		setstate({
			...state,
			user: localStorage.getItem("id"),
		});
	}, []);

	const [loading, setloading] = useState(false);
	const [error, seterr] = useState("");
	const [success, setsuccess] = useState("");
	const [preview, setPreview] = useState();
	const history = useHistory();

	const handleChange = (event) => {
		let val = event.target.value;
		if (event.target.name === "picture") {
			const file = event.target.files[0];
			previewFile(file);
		} else {
			setstate({
				...state,
				[event.target.name]: val,
			});
		}
	};

	const previewFile = (file) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onloadend = () => {
			setPreview(reader.result);
			setstate({
				...state,
				picture: reader.result,
			});
		};
	};

	const submitForm = () => {
		setloading(true);
		fetch("/feed/create", {
			method: "POST",
			body: JSON.stringify(state),
			headers: {
				"Content-Type": "application/json",
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
					setstate({
						caption: "",
						picture: "",
						hashtags: "",
						tags: "",
						location: "",
					});
					setPreview("");
					setloading(false);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};
	return (
		<motion.div
			initial={{ x: "-100px" }}
			animate={{ x: 0 }}
			exit={{ x: "-100vw" }}
			className="flex flex-col items-center mt-16 h-screen w-full"
		>
			{error ? <Error message={error} /> : null}
			{success ? <Success message={success} /> : null}
			{loading && <TopBarProgress />}
			{preview ? (
				<img
					src={preview}
					alt=""
					className="w-52 mx-auto h-52 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md object-contain"
				/>
			) : (
				<div className="w-52 mx-auto h-52 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md">
					Preview Image
				</div>
			)}

			<div className="flex flex-col w-3/4 md:w-2/4 h-auto bg-white rounded-lg p-4 shadow-lg">
				<div className="flex flex-col h-auto">
					<input
						type="text"
						className="input"
						placeholder="Caption"
						value={state.caption}
						name="caption"
						onChange={(event) => handleChange(event)}
					/>
					<input
						type="text"
						className="input"
						placeholder="Hastags"
						value={state.hashtags}
						name="hashtags"
						onChange={(event) => handleChange(event)}
					/>
					<input
						type="text"
						className="input"
						placeholder="User tags"
						value={state.tags}
						name="tags"
						onChange={(event) => handleChange(event)}
					/>

					<input
						type="text"
						className="input"
						placeholder="Location"
						value={state.location}
						name="location"
						onChange={(event) => handleChange(event)}
					/>

					<div className="btn tracking-wide h-auto p-2 border text-gray-500">
						<label
							className="flex cursor-pointer items-center
                        justify-between"
						>
							<span className="">Upload a picture</span>
							<input
								type="file"
								className="hidden"
								placeholder="Choose a picture"
								name="picture"
								accept="image/x-png,image/gif,image/jpeg"
								onChange={(event) => handleChange(event)}
							/>
							<HiOutlinePhotograph size={"1.5rem"} />
						</label>
					</div>
					<button
						onClick={submitForm}
						className="btn btn-primary btn-md text-white mt-2 h-auto"
					>
						{loading ? <Ripple size={20} thickness={3} /> : "Post"}
					</button>
				</div>
			</div>
		</motion.div>
	);
};

export default CreateFeed;

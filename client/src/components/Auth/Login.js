import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { LOGIN, BASE_URL } from "../../config/urls";
import { Ripple } from "react-css-spinners";
import { FcOldTimeCamera } from "react-icons/fc";
import Error from "../UI/Error";

const Login = (props) => {
	const [state, setstate] = useState({
		username: "",
		password: "",
	});

	const [error, seterr] = useState("");
	const [loading, setloading] = useState(false);

	const handleChange = (event) => {
		let val = event.target.value;
		setstate({
			...state,
			[event.target.name]: val,
		});
	};

	const submitForm = () => {
		setloading(true);
		fetch(LOGIN, {
			method: "POST",
			body: JSON.stringify(state),
			headers: { "Content-Type": "application/json" },
		})
			.then((res) => res.json())
			.then((data) => {
				setstate({ username: "", password: "" });
				seterr("");

				if (data.status === "error") {
					seterr(data.message);
					setloading(false);
				} else if (data.code === 1) {
					setloading(false);
					localStorage.setItem("authToken", data.token);
					localStorage.setItem("id", data.user._id);
					props.history.replace("/");
				}
			})
			.catch((err) => {
				console.log(err);
				seterr("Some internal server error. Please try again after some time.");

				setloading(false);
			});
	};
	return (
		<div className="flex h-screen flex-col justify-center items-center bg-gray-50">
			<div className="flex flex-col-reverse items-center justify-around h-20">
				<h1 className="text-4xl font-bold text-gray-700 mt-2">FotoGram</h1>
				<FcOldTimeCamera size={"3rem"} />
			</div>
			{error ? (
				<Error message={error} />
			) : (
				<div className="p-4 mt-3 mb-4"></div>
			)}

			<div className="flex flex-col w-3/4 md:w-2/6 h-auto bg-white rounded-lg p-4 shadow-lg">
				<h1 className="text-3xl text-gray-600  font-bold">Login</h1>

				<div className="flex flex-col h-auto mt-5 mb-5">
					<input
						type="text"
						className="input font-semibold text-gray-600"
						placeholder="Username"
						value={state.username}
						name="username"
						onChange={(event) => handleChange(event)}
					/>

					<input
						type="password"
						className="input font-semibold text-gray-600"
						placeholder="Password"
						value={state.password}
						name="password"
						onChange={(event) => handleChange(event)}
					/>
					<button
						onClick={submitForm}
						className="btn btn-primary btn-md mt-2 h-auto"
						disabled={loading}
					>
						{loading ? <Ripple size={20} thickness={3} /> : "Login"}
					</button>
				</div>
			</div>
			<div className="flex text-gray-500 mt-4">
				Don't have an account?
				<span className="ml-2 text-purple-500 font-semibold">
					<Link to="/register">Register here</Link>
				</span>{" "}
			</div>
		</div>
	);
};

export default Login;

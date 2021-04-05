import React, { useState } from "react";
import { Ripple } from "react-css-spinners";
import { FcOldTimeCamera } from "react-icons/fc";
import { Link, Redirect } from "react-router-dom";
import { BASE_URL, REGISTER } from "../../config/urls";
import Error from "../UI/Error";
import Success from "../UI/Success";

const Register = () => {
	const [state, setstate] = useState({
		name: "",
		email: "",
		username: "",
		password: "",
	});
	const [error, seterr] = useState("");
	const [success, setsuccess] = useState("");
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
		fetch(REGISTER, {
			method: "POST",
			body: JSON.stringify(state),
			headers: { "Content-Type": "application/json" },
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				console.log(data);

				if (data.status === "error") {
					seterr(data.message);
				} else if (data.code === 1) {
					seterr("");
					setsuccess(data.message);
					setstate({ name: "", email: "", password: "", username: "" });
				}
				setloading(false);
			})
			.catch((err) => {
				console.log(err);
			});
	};
	return (
		<div className="flex h-screen flex-col justify-center items-center bg-gray-50">
			<div className="flex flex-col-reverse items-center justify-around h-20">
				<h1 className="text-4xl font-bold text-gray-700 mt-2">FotoGram</h1>
				<FcOldTimeCamera size={"3rem"} />
			</div>
			{error ? <Error message={error} /> : null}
			{success ? <Success message={success} /> : null}
			<div className="flex flex-col w-3/4 md:w-2/6 h-auto bg-white rounded-lg p-4 mt-3 shadow-lg">
				<h1 className="text-3xl text-gray-600  font-bold">Create an account</h1>

				<div className="flex flex-col h-auto mt-5 mb-5">
					<input
						type="text"
						className="input"
						placeholder="Email"
						value={state.email}
						name="email"
						onChange={(event) => handleChange(event)}
					/>
					<input
						type="text"
						className="input"
						placeholder="Name"
						value={state.name}
						name="name"
						onChange={(event) => handleChange(event)}
					/>
					<input
						type="text"
						className="input"
						placeholder="Username"
						value={state.username}
						name="username"
						onChange={(event) => handleChange(event)}
					/>
					<input
						type="password"
						className="input"
						placeholder="Password"
						value={state.password}
						name="password"
						onChange={(event) => handleChange(event)}
					/>
					<button
						className="btn flex justify-center bg-purple-600 text-white mt-2 items-center"
						onClick={submitForm}
						disabled={loading}
					>
						{loading ? <Ripple size={27} thickness={2} /> : "Sign up"}
					</button>
				</div>
			</div>
			<div className="flex text-gray-500 mt-4">
				Already have an account?
				<span className="ml-2 text-purple-500 font-semibold">
					<Link to="/login">Login here</Link>
				</span>{" "}
			</div>
		</div>
	);
};

export default Register;

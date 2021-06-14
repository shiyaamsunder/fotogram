import React, { useEffect, useState } from 'react';
import { FcOldTimeCamera } from 'react-icons/fc';
import { REGISTER } from '../config/urls';
import Form from '../components/form'
import Error from '../components/UI/Error';
import Success from '../components/UI/Success';

export default function SignUp() {
	const [state, setstate] = useState({
		name: '',
		email: '',
		username: '',
		password: '',
	});
	const [error, seterr] = useState('');
	const [success, setsuccess] = useState('');
	const [loading, setloading] = useState(false);

	useEffect(() => {
		document.title = 'Register - Fotogram';
	}, []);

	const handleChange = (event) => {
		let val = event.target.value;
		setstate({
			...state,
			[event.target.name]: val,
		});
	};

	const submitForm = (event) => {
		event.preventDefault();
		setloading(true);
		fetch(REGISTER, {
			method: 'POST',
			body: JSON.stringify(state),
			headers: { 'Content-Type': 'application/json' },
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				console.log(data);

				if (data.status === 'error') {
					seterr(data.message);
				} else if (data.code === 1) {
					seterr('');
					setsuccess(data.message);
					setstate({ name: '', email: '', password: '', username: '' });
				}
				setloading(false);
			})
			.catch((err) => {
				console.log(err);
			});
	};
	return (
		<div className="flex h-screen flex-col justify-center items-center bg-gray-50 dark:bg-dark-25 dark:text-gray-50">
			<FcOldTimeCamera
				size={'3rem'}
				style={{ position: 'absolute', top: 50, marginBottom: '1rem' }}
			/>
			<Form>
				{error && <Error message={error} />}
				{success && <Success message={success} />}
				<Form.Base onSubmit={submitForm} method="POST">
					<Form.Title>Create an account</Form.Title>
					<Form.Group>
						<Form.Input
							type="text"
							value={state.name}
							placeholder="Name"
							name="name"
							onChange={handleChange}
						/>
						<Form.Input
							type="email"
							placeholder="Email"
							name="email"
							value={state.email}
							onChange={handleChange}
						/>
						<Form.Input
							type="text"
							value={state.username}
							placeholder="Username"
							name="username"
							onChange={handleChange}
						/>
						<Form.Input
							type="password"
							placeholder="Password"
							autoComplete="off"
							name="password"
							value={state.password}
							onChange={handleChange}
						/>
					</Form.Group>
					<Form.Submit type="submit" disabled={loading}>
						Register
					</Form.Submit>
				</Form.Base>
				<Form.Bottom>
					Already have an account?
					<Form.Link to="/signin">Login here</Form.Link>
				</Form.Bottom>
			</Form>
		</div>
	);
}

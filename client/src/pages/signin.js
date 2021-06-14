import React, { useEffect, useState } from 'react';
import { LOGIN } from '../config/urls';
import { FcOldTimeCamera } from 'react-icons/fc';
import Error from '../components/UI/Error';
import Form from '../components/form';

export default function SignIn(props) {
	const [state, setstate] = useState({
		username: '',
		password: '',
	});
	const [error, seterr] = useState('');
	const [loading, setloading] = useState(false);

	useEffect(() => {
		document.title = 'Login - Fotogram';
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
		fetch(LOGIN, {
			method: 'POST',
			body: JSON.stringify(state),
			headers: { 'Content-Type': 'application/json' },
		})
			.then((res) => res.json())
			.then((data) => {
				setstate({ username: '', password: '' });
				seterr('');

				if (data.status === 'error') {
					seterr(data.message);
					setloading(false);
				} else if (data.code === 1) {
					setloading(false);
					localStorage.setItem('authToken', data.token);
					localStorage.setItem('id', data.user._id);
					props.history.replace('/home');
				}
			})
			.catch((err) => {
				console.log(err);
				seterr('Some internal server error. Please try again after some time.');

				setloading(false);
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
				<Form.Base onSubmit={submitForm} method="POST">
					<Form.Title>Login</Form.Title>
					<Form.Group>
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
						Login
					</Form.Submit>
				</Form.Base>
				<Form.Bottom>
					Don't have an account?
					<Form.Link to="/signup">Register here</Form.Link>
				</Form.Bottom>
			</Form>
		</div>
	);
}

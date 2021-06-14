import React, { useContext, useEffect, useState } from 'react';
import { USER, USER_UPDATE } from '../../config/urls';
import Error from '../UI/Error';
import Success from '../UI/Success';
import Context from '../../store/Context';
import Form from '../form/index';
import TopBarProgress from 'react-topbar-progress-indicator';

const EditProfile = () => {
	// LoadingBar config
	TopBarProgress.config({
		barColors: {
			0: '#8b5cf6',
			0.5: '#7c3aed',
			'1.0': '#a78bfa',
		},
		shadowBlur: 5,
	});

	const [profile, setprofile] = useState({
		username: '',
		bio: '',
		profile_picture: '',
		account_type: '',
	});
	const [error, seterr] = useState('');
	const [success, setsuccess] = useState('');
	const [loading, setloading] = useState(false);

	const { globalDispatch } = useContext(Context);
	const [preview, setPreview] = useState();

	let currentUser_id = localStorage.getItem('id');
	let token = localStorage.getItem('authToken');

	// fetching the profile data on load
	useEffect(() => {
		setloading(true);
		fetch(USER + currentUser_id, {
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
				globalDispatch({ type: 'SET_USER', payload: { user: data } });
				setloading(false);
			});
	}, []);

	// dealing with input changes
	const handleChange = (event) => {
		let val = event.target.value;
		if (event.target.name === 'picture') {
			const file = event.target.files[0];
			previewFile(file);
		} else {
			setprofile({
				...profile,
				[event.target.name]: val,
			});
		}
	};

	// helper function to preview photo
	const previewFile = (file) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onloadend = () => {
			setPreview(reader.result);
			setprofile({
				...profile,
				profile_picture: reader.result,
			});
		};
	};

	const submitForm = (event) => {
		event.preventDefault();
		setloading(true);
		fetch(USER_UPDATE + currentUser_id, {
			method: 'PUT',
			body: JSON.stringify(profile),
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				'Content-Type': 'application/json',
			},
		})
			.then((res) => res.json())
			.then((data) => {
				seterr(null);
				setsuccess(null);
				if (data.status === 'error') {
					setloading(false);
					seterr(data.message);
				}
				if (data.code === 1) {
					setsuccess(data.message);
					setloading(false);
					globalDispatch({
						type: 'SET_USER',
						payload: {
							user: profile,
						},
					});
				}
			})
			.catch((err) => {
				setloading(false);
				console.log(err);
			});
	};

	return (
		<div className="flex flex-col items-center mt-14 p-8 mb-16 w-full mx-auto">
			{error ? <Error message={error} /> : null}
			{success ? <Success message={success} /> : null}
			{loading ? <TopBarProgress /> : null}
			<div className="flex flex-col items-center mb-3">
				{profile.profile_picture !== '' ? (
					<img
						src={!preview ? profile.profile_picture : preview}
						alt="profile"
						className="rounded-full object-cover w-28 h-28 mb-2"
					/>
				) : (
					<p className="rounded-full object-cover w-28 h-28 mb-2 text-center bg-purple-400 flex items-center justify-center">
						No profile picture
					</p>
				)}

				<Form.PicUpload name="picture" onChange={handleChange}>
					Change Profile Picture
				</Form.PicUpload>
			</div>

			<Form>
				<Form.Base onSubmit={submitForm} method="POST">
					<Form.Group>
						<Form.Label>Username</Form.Label>
						<Form.Input
							type="text"
							placeholder="Username"
							defaultValue={profile.username}
							onChange={handleChange}
							name="username"
							size="lg"
						/>
						<Form.Label>Name</Form.Label>
						<Form.Input
							type="text"
							placeholder="Name"
							defaultValue={profile.name}
							name="name"
							onChange={handleChange}
							size="lg"
						/>
						<Form.Label>Bio</Form.Label>
						<Form.Input
							type="text"
							placeholder="bio"
							defaultValue={profile.bio}
							onChange={handleChange}
							name="bio"
							size="lg"
						/>
					</Form.Group>
					<Form.Submit type="submit">Save Changes</Form.Submit>
				</Form.Base>
			</Form>
		</div>
	);
};

export default EditProfile;

import React, { useEffect, useState } from 'react';
import Error from '../UI/Error';
import Success from '../UI/Success';
import { motion } from 'framer-motion';
import TopBarProgress from 'react-topbar-progress-indicator';
import { Container } from '../../layout';
import Form from '../form';

const CreateFeed = () => {
	const [state, setstate] = useState({
		caption: '',
		picture: '',
		hashtags: '',
		tags: '',
		location: '',
		user: '',
	});

	// Loading bar config
	TopBarProgress.config({
		barColors: {
			0: '#8b5cf6',
			0.5: '#7c3aed',
			'1.0': '#a78bfa',
		},
		shadowBlur: 5,
	});

	useEffect(() => {
		window.scrollTo(0, 0);
		setstate((state) => ({
			...state,
			user: localStorage.getItem('id'),
		}));
	}, []);

	const [loading, setloading] = useState(false);
	const [error, seterr] = useState('');
	const [success, setsuccess] = useState('');
	const [preview, setPreview] = useState();

	const handleChange = (event) => {
		let val = event.target.value;
		if (event.target.name === 'picture') {
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

	const submitForm = (event) => {
		event.preventDefault();
		setloading(true);
		fetch('api/feed/create', {
			method: 'POST',
			body: JSON.stringify(state),
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				seterr(null);
				setsuccess(null);
				if (data.status === 'error') {
					seterr(data.message);
				}
				if (data.code === 1) {
					setsuccess(data.message);
					setstate({
						caption: '',
						picture: '',
						hashtags: '',
						tags: '',
						location: '',
					});
					setPreview('');
					setloading(false);
				}
			})
			.catch((err) => {
				setloading(false);
			});
	};

	return (
		<motion.div
			initial={{ x: '-100px' }}
			animate={{ x: 0 }}
			exit={{ x: '-100vw' }}
			className="flex flex-col justify-items-center  items-center py-20 h-auto w-full"
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
				<div className="w-52 mx-auto h-52 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md dark:text-gray-50">
					Preview Image
				</div>
			)}
			<Container>
				<Form>
					<Form.Base onSubmit={submitForm} method="POST">
						<Form.Group>
							<Form.Input
								placeholder="Caption"
								name="caption"
								onChange={handleChange}
								value={state.caption}
							/>
							<Form.PicUpload name="picture" onChange={handleChange}>
								Upload a picture
							</Form.PicUpload>
						</Form.Group>
						<Form.Submit type="submit" disabled={loading}>
							Post
						</Form.Submit>
					</Form.Base>
				</Form>
			</Container>
		</motion.div>
	);
};

export default CreateFeed;

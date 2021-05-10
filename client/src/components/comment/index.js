import { Link } from 'react-router-dom';

export default function Comment({ children, ...restProps }) {
	return (
		<div
			{...restProps}
			className="p-1 border-b border-gray-200 w-full rounded flex items-center my-1"
		>
			{children}
		</div>
	);
}

Comment.ProfilePicture = function commentProfilePicture({
	profile_picture,
	username = '',
	...restProps
}) {
	const initialAvatar = `https://ui-avatars.com/api/?name=${username}&uppercase="false"?background=random`;
	return (
		<img
			src={!profile_picture ? initialAvatar : profile_picture}
			alt="profile"
			className="rounded-full object-cover w-8 h-8 mr-1"
			{...restProps}
		/>
	);
};

Comment.User = function commentUser({ children, ...restprops }) {
	return (
		<Link {...restprops} className="font-semibold text-xs text-purple-700">
			{children}
		</Link>
	);
};

Comment.Text = function commentText({ children, ...restProps }) {
	return <p className="font-semibold text-sm">{children}</p>;
};

Comment.Content = function commentContent({ children, ...restProps }) {
	return (
		<div className="flex flex-col items-start ml-1" {...restProps}>
			{children}
		</div>
	);
};

Comment.TimeStamp = function commentTimeStamp({ children, ...restProps }) {
	return (
		<span className="ml-auto text-xs font-medium text-gray-500" {...restProps}>
			{children}
		</span>
	);
};

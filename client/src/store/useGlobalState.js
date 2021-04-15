import { useReducer } from "react";

const initialState = {
	feeds: [],
	user: {},
	randomFeeds: [],
	profile: {
		feeds: [],
		influencers: [],
		followers: [],
	},
	user2: "",
};
const reducer = (state, action) => {
	switch (action.type) {
		case "SET_FEEDS":
			return {
				...state,
				feeds: action.payload.feeds,
			};
		case "SET_RANDOM_FEEDS":
			return {
				...state,
				feeds: action.payload.random,
			};
		case "GET_FEEDS":
			return state;

		case "SET_USER":
			return {
				...state,
				user: action.payload.user,
			};

		case "SET_USER2":
			return {
				...state,
				user2: action.payload.user2,
			};

		case "SET_PROFILE":
			return {
				...state,
				profile: action.payload.profile,
			};
		default:
			return state;
	}
};

const useGlobalState = () => {
	const [globalState, globalDispatch] = useReducer(reducer, initialState);

	return { globalState, globalDispatch };
};

export default useGlobalState;

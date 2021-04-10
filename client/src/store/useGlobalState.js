import { useReducer } from "react";

const initialState = {
	feeds: [],
	user: {},
	randomFeeds: [],
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
		default:
			return state;
	}
};

const useGlobalState = () => {
	const [globalState, globalDispatch] = useReducer(reducer, initialState);

	return { globalState, globalDispatch };
};

export default useGlobalState;

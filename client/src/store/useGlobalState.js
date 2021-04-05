import { useReducer } from "react";

const initialState = {
	feeds: [],
	user: {},
};
const reducer = (state, action) => {
	switch (action.type) {
		case "SET_FEEDS":
			return {
				...state,
				feeds: action.payload.feeds,
			};
		case "GET_FEEDS":
			return state;
		default:
			return state;
		case "SET_USER":
			return {
				...state,
				user: action.payload.user,
			};
	}
};

const useGlobalState = () => {
	const [globalState, globalDispatch] = useReducer(reducer, initialState);

	return { globalState, globalDispatch };
};

export default useGlobalState;

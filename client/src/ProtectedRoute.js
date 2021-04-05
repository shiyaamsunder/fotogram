import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";

const ProtectedRoute = ({ children, ...rest }) => {
	const token = localStorage.getItem("authToken");

	return (
		<Route
			{...rest}
			render={() => {
				return token ? children : <Redirect to="/login" />;
			}}
		/>
	);
};

export default ProtectedRoute;

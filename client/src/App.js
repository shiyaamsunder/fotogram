import {
	BrowserRouter as Router,
	Route,
	Switch,
	useLocation,
} from "react-router-dom";
import Register from "./components/Auth/Register";
import Home from "./components/Home";
import Login from "./components/Auth/Login";
import ProtectedRoute from "./ProtectedRoute";
import Profile from "./components/Profile/Profile";
import NavBar from "./components/UI/NavBar";
import CreateFeed from "./components/Profile/CreateFeed";
import { AnimatePresence } from "framer-motion";
import EditProfile from "./components/Profile/EditProfile";
import GlobalStateProvider from "./store/GlobalStateProvider";
import Search from "./components/Search/Search";
import ChatHome from "./components/Chat/ChatHome";

function App() {
	let location = useLocation();

	return (
		<div>
			<AnimatePresence>
				<GlobalStateProvider>
					<Switch location={location} key={location.key}>
						<Route path="/register" component={Register} />
						<Route path="/login" component={Login} />
						<ProtectedRoute>
							<NavBar />

							<Route exact path="/" component={Home} />
							<Route path="/home" component={Home} />
							<Route path="/profile/:username" component={Profile} />
							<Route path="/create" exact component={CreateFeed} />
							<Route path="/edit" exact component={EditProfile} />
							<Route path="/search" exact component={Search} />
							<Route path="/chat" exact component={ChatHome} />
						</ProtectedRoute>
					</Switch>
				</GlobalStateProvider>
			</AnimatePresence>
		</div>
	);
}

export default App;

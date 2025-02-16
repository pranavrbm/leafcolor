import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

import Navbar from "./components/Navbar";

const App = () => {
	return (
		<Router>
			<div>
				<Navbar />
				<Routes>
					<Route
						path="/"
						element={<Home />}
					/>
					<Route
						path="/Home"
						element={<Home />}
					/>
					<Route
						path="/Base"
						element={<Profile />}
					/>
				</Routes>
			</div>
		</Router>
	);
};

export default App;

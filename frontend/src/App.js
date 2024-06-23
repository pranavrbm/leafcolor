import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
// import Contact from './pages/Contact';
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
						path="/Profile"
						element={<Profile />}
					/>
					{/* <Route path="/contact" element={<Contact />} /> */}
				</Routes>
			</div>
		</Router>
	);
};

export default App;

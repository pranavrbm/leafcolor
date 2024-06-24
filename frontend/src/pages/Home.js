import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
const Home = () => {
	return (
		<ul>
			<li>
				<Link to="/Calibration">
					<h1>calibration</h1>
				</Link>
			</li>

			<li>
				<Link to="/Camera">
					<h1>camera</h1>
				</Link>
			</li>
		</ul>
		// <a href="/Calibration">calibration</a>
	);
};

export default Home;

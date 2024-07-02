import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
	return (
		<>
			<Link to="/Base">
				<h1>Base model</h1>
			</Link>
		</>

		// <a href="/Calibration">calibration</a>
	);
};

export default Home;

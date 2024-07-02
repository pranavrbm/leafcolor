import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import ImageUpload from "../components/ImageUpload.js";

const Home = () => {
	return (
		<>
			<Link to="/Calibration">
				<h1>calibration</h1>
			</Link>
			<Link to="/Camera">
				<h1>camera</h1>
			</Link>
			<main>
				<ImageUpload />
			</main>
		</>

		// <a href="/Calibration">calibration</a>
	);
};

export default Home;

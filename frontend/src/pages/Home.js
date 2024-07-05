// import React from "react";
// import { Link } from "react-router-dom";
// import "../styles/Home.css";

// const Home = () => {
// 	return (
// 		<>
// 			<Link to="/Base">
// 				<h1>Base model</h1>
// 			</Link>
// 		</>

// 		// <a href="/Calibration">calibration</a>
// 	);
// };

// export default Home;

// src/App.js
import React, { useState } from "react";
import axios from "axios";

function Home() {
	const [selectedFile, setSelectedFile] = useState(null);
	const [result, setResult] = useState(null);

	const handleFileChange = (event) => {
		setSelectedFile(event.target.files[0]);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const formData = new FormData();
		formData.append("image", selectedFile);

		try {
			const response = await axios.post(
				"http://localhost:8000/Home/upload/",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			setResult(response.data);
		} catch (error) {
			console.error("Error uploading file:", error);
		}
	};

	return (
		<div className="App">
			<h1>Leaf Image Upload</h1>
			<form onSubmit={handleSubmit}>
				<input
					type="file"
					onChange={handleFileChange}
				/>
				<button type="submit">Upload</button>
			</form>
			{result && (
				<div>
					<h2>Result</h2>
					<p>Actual RGB Value: {result.actual_rgb_value}</p>
					<p>Category: {result.category}</p>
				</div>
			)}
		</div>
	);
}

export default Home;

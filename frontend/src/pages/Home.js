// src/Profile.js
import React, { useState, useRef } from "react";
import axios from "axios";
import Webcam from "react-webcam";

function Home() {
	const [selectedFile, setSelectedFile] = useState(null);
	const [capturedImage, setCapturedImage] = useState(null);
	const [processedData, setProcessedData] = useState(null);
	const [useWebcam, setUseWebcam] = useState(false);
	const webcamRef = useRef(null);

	const handleFileChange = (event) => {
		setSelectedFile(event.target.files[0]);
		setCapturedImage(null);
		setProcessedData(null);
	};

	const handleUpload = () => {
		if (selectedFile) {
			const formData = new FormData();
			formData.append("image", selectedFile);

			axios
				.post("http://localhost:8000/Home/upload/", formData)
				.then((response) => {
					setProcessedData(response.data);
				})
				.catch((error) => {
					console.error(
						"There was an error uploading the image!",
						error
					);
				});
		}
	};

	const handleCapture = () => {
		const imageSrc = webcamRef.current.getScreenshot();
		if (imageSrc) {
			fetch(imageSrc)
				.then((res) => res.blob())
				.then((blob) => {
					const file = new File([blob], "captured.jpg", {
						type: "image/jpeg",
					});
					setSelectedFile(file);
					setCapturedImage(imageSrc);
					setUseWebcam(false); // Close the camera after capturing
					setProcessedData(null);
				});
		}
	};

	return (
		<div className="App">
			<h1>Color detection using chat as reference</h1>
			<button onClick={() => setUseWebcam(!useWebcam)}>
				{useWebcam ? "Switch to File Upload" : "Switch to Webcam"}
			</button>
			{useWebcam ? (
				<div>
					<Webcam
						audio={false}
						ref={webcamRef}
						screenshotFormat="image/jpeg"
						width={320}
						height={240}
					/>
					<button onClick={handleCapture}>Capture Photo</button>
				</div>
			) : (
				<div>
					<input
						type="file"
						onChange={handleFileChange}
					/>
				</div>
			)}
			<button onClick={handleUpload}>Upload</button>
			{capturedImage && (
				<div>
					<h3>Captured Image</h3>
					<img
						src={capturedImage}
						alt="Captured"
					/>
				</div>
			)}
			{processedData && (
				<div>
					<h2>Processed Data</h2>
					{processedData.green_object_image && (
						<div>
							<h3>Green Object Detection</h3>
							<img
								src={`data:image/jpeg;base64,${processedData.green_object_image}`}
								alt="Green Object"
							/>
						</div>
					)}
					<div>
						<h3>RGB Category</h3>
						<p>
							Actual RGB Value:{" "}
							{processedData.actual_rgb_value.join(", ")}
						</p>
						<p>Category: {processedData.category}</p>
					</div>
				</div>
			)}
		</div>
	);
}

export default Home;

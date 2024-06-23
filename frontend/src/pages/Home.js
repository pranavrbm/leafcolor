// import React from "react";

// const Home = () => {
// 	return <h1>Home Page</h1>;
// };

// export default Home;
import React, { useRef, useState } from "react";
import axios from "axios";

function App() {
	const videoRef = useRef(null);
	const canvasRef = useRef(null);
	const [images, setImages] = useState([]);
	const [calibrationData, setCalibrationData] = useState(null);

	const startCamera = () => {
		navigator.mediaDevices
			.getUserMedia({ video: true })
			.then((stream) => {
				videoRef.current.srcObject = stream;
			})
			.catch((err) => {
				console.error("Error accessing camera: ", err);
			});
	};

	const captureImage = () => {
		if (images.length >= 10) {
			alert("You have already captured 10 images.");
			return;
		}

		const context = canvasRef.current.getContext("2d");
		context.drawImage(videoRef.current, 0, 0, 640, 480);
		const dataURL = canvasRef.current.toDataURL("image/png");
		setImages([...images, dataURL]);
	};

	const uploadImages = () => {
		if (images.length !== 10) {
			alert("Please capture exactly 10 images.");
			return;
		}

		const formData = new FormData();
		images.forEach((image, index) => {
			formData.append("file", dataURLtoBlob(image), `image_${index}.png`);
		});

		axios
			.post("http://localhost:8000/calibrate/", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then((response) => {
				console.log("Images uploaded successfully: ", response.data);
				setCalibrationData(response.data.calibration_data);
			})
			.catch((error) => {
				console.error("Error uploading images: ", error);
			});
	};

	const dataURLtoBlob = (dataurl) => {
		var arr = dataurl.split(","),
			mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]),
			n = bstr.length,
			u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new Blob([u8arr], { type: mime });
	};

	return (
		<div className="App">
			<button onClick={startCamera}>Start Camera</button>
			<video
				ref={videoRef}
				width="640"
				height="480"
				autoPlay></video>
			<button onClick={captureImage}>Capture Image</button>
			<canvas
				ref={canvasRef}
				width="640"
				height="480"
				style={{ display: "none" }}></canvas>
			<button onClick={uploadImages}>Upload Images</button>
			<div>
				<h3>Captured Images:</h3>
				{images.map((image, index) => (
					<img
						key={index}
						src={image}
						alt={`Captured ${index}`}
						width="160"
					/>
				))}
			</div>
			{calibrationData && (
				<div>
					<h3>Calibration Results:</h3>
					<pre>{JSON.stringify(calibrationData, null, 2)}</pre>
				</div>
			)}
		</div>
	);
}

export default App;

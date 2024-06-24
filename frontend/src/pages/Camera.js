import React, { useRef, useCallback, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const Camera = () => {
	const webcamRef = useRef(null);
	const [capturedImage, setCapturedImage] = useState(null);
	const [croppedImage, setCroppedImage] = useState(null);
	const [cameraOn, setCameraOn] = useState(true);

	const capture = useCallback(() => {
		const imageSrc = webcamRef.current.getScreenshot();
		setCapturedImage(imageSrc);
		if (imageSrc) {
			const byteString = atob(imageSrc.split(",")[1]);
			const ab = new ArrayBuffer(byteString.length);
			const ia = new Uint8Array(ab);
			for (let i = 0; i < byteString.length; i++) {
				ia[i] = byteString.charCodeAt(i);
			}
			const blob = new Blob([ab], { type: "image/jpeg" });
			const formData = new FormData();
			formData.append("image", blob, "captured.jpg");

			axios
				.post("http://localhost:8000/Camera/upload/", formData)
				.then((response) => {
					setCroppedImage(
						`data:image/jpeg;base64,${response.data.cropped_image}`
					);
				})
				.catch((error) => {
					console.error(
						"There was an error uploading the image!",
						error
					);
				});
		}
	}, [webcamRef]);

	const toggleCamera = () => {
		setCameraOn(!cameraOn);
	};

	return (
		<div>
			{cameraOn && (
				<Webcam
					audio={false}
					ref={webcamRef}
					screenshotFormat="image/jpeg"
					width="100%"
				/>
			)}
			<button
				onClick={capture}
				disabled={!cameraOn}>
				Capture Photo
			</button>
			<button onClick={toggleCamera}>
				{cameraOn ? "Stop Camera" : "Start Camera"}
			</button>
			{capturedImage && (
				<div>
					<h2>Captured Image:</h2>
					<img
						src={capturedImage}
						alt="Captured"
					/>
				</div>
			)}
			{croppedImage && (
				<div>
					<h2>Cropped Image:</h2>
					<img
						src={croppedImage}
						alt="Cropped"
					/>
				</div>
			)}
		</div>
	);
};

export default Camera;

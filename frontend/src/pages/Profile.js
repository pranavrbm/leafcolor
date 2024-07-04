import React, { useState, useRef } from "react";
import axios from "axios";
import Webcam from "react-webcam";

function Profile() {
	const [selectedFile, setSelectedFile] = useState(null);
	const [capturedImage, setCapturedImage] = useState(null);
	const [processedData, setProcessedData] = useState(null);
	const [selectedLeafIndex, setSelectedLeafIndex] = useState(null);
	const [useWebcam, setUseWebcam] = useState(false);
	const webcamRef = useRef(null);

	const handleFileChange = (event) => {
		setSelectedFile(event.target.files[0]);
		setCapturedImage(null);
	};

	const handleUpload = () => {
		if (selectedFile) {
			const formData = new FormData();
			formData.append("image", selectedFile);

			axios
				.post("http://localhost:8000/api/process_image/", formData)
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
				});
		}
	};

	const handleSelectLeaf = (index) => {
		setSelectedLeafIndex(index);
		const formData = new FormData();
		formData.append("image", selectedFile);
		formData.append("selected_leaf_index", index);

		axios
			.post("http://localhost:8000/api/process_image/", formData)
			.then((response) => {
				setProcessedData(response.data);
			})
			.catch((error) => {
				console.error(
					"There was an error processing the image!",
					error
				);
			});
	};

	return (
		<div className="App">
			<h1>Image Processing PWA</h1>
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
					{capturedImage && (
						<div>
							<h3>Captured Image</h3>
							<img
								src={capturedImage}
								alt="Captured"
							/>
						</div>
					)}
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
			{processedData && (
				<div>
					<h2>Processed Data</h2>
					{/* {processedData.original_image && (
						<div>
							<h3>Original Image</h3>
							<img
								src={`data:image/jpeg;base64,${processedData.original_image}`}
								alt="Original"
							/>
						</div>
					)} */}
					{processedData.green_objects_image && (
						<div>
							<h3>Green Objects Detection</h3>
							<img
								src={`data:image/jpeg;base64,${processedData.green_objects_image}`}
								alt="Green Objects"
							/>
						</div>
					)}
					{processedData.cropped_images &&
						processedData.cropped_images.length > 0 && (
							<div>
								<h3>Cropped Images</h3>
								{processedData.cropped_images.map(
									(image, index) => (
										<div key={index}>
											<h4>Object {index}</h4>
											<img
												src={`data:image/jpeg;base64,${image}`}
												alt={`Object ${index}`}
											/>
											<button
												onClick={() => {
													handleSelectLeaf(index);
												}}>
												Select This Leaf
											</button>
										</div>
									)
								)}
							</div>
						)}
					{processedData.comparison_results &&
						processedData.comparison_results.length > 0 && (
							<div>
								<h3>Comparison Results</h3>
								<table>
									<thead>
										<tr>
											<th>Index</th>
											<th>Image</th>
											<th>Similarity (%)</th>
											<th>Average RGB</th>
										</tr>
									</thead>
									<tbody>
										{processedData.comparison_results.map(
											(result, index) => (
												<tr key={index}>
													<td>{result.index}</td>
													<td>
														<img
															src={`data:image/jpeg;base64,${result.image}`}
															alt={`Object ${result.index}`}
														/>
													</td>
													<td>{result.similarity}</td>
													<td>
														{result.average_rgb.join(
															",  "
														)}
													</td>
												</tr>
											)
										)}
									</tbody>
								</table>
							</div>
						)}
					{processedData.selected_leaf_index !== undefined && (
						<div>
							<h3>
								Most Similar Object Index:{" "}
								{processedData.most_similar_index}
							</h3>
							<h3>
								Most Similar RGB:{" "}
								{processedData.most_similar_rgb.join(",  ")}
							</h3>
							{/* <h3>
								Bounding Box:{" "}
								{processedData.bounding_box.join(",  ")}
							</h3> */}
							{processedData.most_similar_image && (
								<div>
									<h3>Most Similar Object</h3>
									<img
										src={`data:image/jpeg;base64,${processedData.most_similar_image}`}
										alt="Most Similar Object"
									/>
								</div>
							)}
							<h3>
								Selected Leaf Index:{" "}
								{processedData.selected_leaf_index}
							</h3>

							<h3>
								Selected Leaf Average RGB:{" "}
								{processedData.most_similar_rgb.join(",  ")}
							</h3>
							{processedData.selected_leaf && (
								<div>
									<h3>Selected leaf</h3>
									<img
										src={`data:image/jpeg;base64,${processedData.selected_leaf}`}
										alt="Selected leaf"
									/>
								</div>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export default Profile;

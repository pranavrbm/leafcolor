import React, { useState } from "react";
import axios from "axios";
// import "./App.css";

function Profile() {
	const [selectedFile, setSelectedFile] = useState(null);
	const [processedData, setProcessedData] = useState(null);
	const [selectedLeafIndex, setSelectedLeafIndex] = useState(null);

	const handleFileChange = (event) => {
		setSelectedFile(event.target.files[0]);
	};

	const handleUpload = () => {
		const formData = new FormData();
		formData.append("image", selectedFile);

		axios
			.post("http://localhost:8000/api/process_image/", formData)
			.then((response) => {
				setProcessedData(response.data);
			})
			.catch((error) => {
				console.error("There was an error uploading the image!", error);
			});
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
			<input
				type="file"
				onChange={handleFileChange}
			/>
			<button onClick={handleUpload}>Upload</button>
			{processedData && (
				<div>
					<h2>Processed Data</h2>
					{processedData.original_image && (
						<div>
							<h3>Original Image</h3>
							<img
								src={`data:image/jpeg;base64,${processedData.original_image}`}
								alt="Original"
							/>
						</div>
					)}
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
												onClick={() =>
													handleSelectLeaf(index)
												}>
												Select This Leaf
											</button>
										</div>
									)
								)}
							</div>
						)}
					{processedData.selected_leaf_index !== undefined && (
						<div>
							<h3>
								Selected Leaf Index:{" "}
								{processedData.selected_leaf_index}
							</h3>
							<h3>
								Most Similar Object Index:{" "}
								{processedData.most_similar_index}
							</h3>
							<h3>
								Most Similar HSV:{" "}
								{processedData.most_similar_hsv.join(", ")}
							</h3>
							<h3>
								Bounding Box:{" "}
								{processedData.bounding_box.join(", ")}
							</h3>
							{processedData.most_similar_image && (
								<div>
									<h3>Most Similar Object</h3>
									<img
										src={`data:image/jpeg;base64,${processedData.most_similar_image}`}
										alt="Most Similar Object"
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

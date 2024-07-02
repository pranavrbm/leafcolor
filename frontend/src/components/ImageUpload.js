import React, { useState } from "react";
import axios from "axios";

const ImageUpload = () => {
	const [selectedFile, setSelectedFile] = useState(null);
	const [imageUrl, setImageUrl] = useState("");
	const [result, setResult] = useState(null);

	const handleFileChange = (event) => {
		setSelectedFile(event.target.files[0]);
	};

	const handleUpload = () => {
		const formData = new FormData();
		formData.append("image", selectedFile);

		axios
			.post("http://localhost:8000/api/upload/", formData)
			.then((response) => {
				setResult(response.data);
			})
			.catch((error) => {
				console.error("There was an error uploading the file!", error);
			});
	};

	return (
		<div>
			<input
				type="file"
				onChange={handleFileChange}
			/>
			<button onClick={handleUpload}>Upload</button>
			{result && (
				<div>
					<h3>Processed Image Results</h3>
					{result.bounding_boxes.map((box, index) => (
						<div key={index}>
							<p>
								Bounding Box {index + 1}: {box}
							</p>
							<p>
								Average HSV {index + 1}:{" "}
								{result.average_hsvs[index]}
							</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default ImageUpload;

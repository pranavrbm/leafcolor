import React, { useState } from "react";

const LeafDetectionForm = ({ onProcessImage }) => {
	const [imageFile, setImageFile] = useState(null);

	const handleFileChange = (e) => {
		setImageFile(e.target.files[0]);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (imageFile) {
			const formData = new FormData();
			formData.append("image", imageFile);
			onProcessImage(formData);
		} else {
			alert("Please select an image file.");
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="file"
				accept="image/*"
				onChange={handleFileChange}
			/>
			<button type="submit">Process Image</button>
		</form>
	);
};

export default LeafDetectionForm;

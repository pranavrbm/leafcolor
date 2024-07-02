import React from "react";

const LeafResults = ({ results }) => {
	return (
		<div className="LeafResults">
			<h2>Leaf Detection Results</h2>
			<div>
				<h3>Original Image</h3>
				<img
					src={`data:image/png;base64,${results.image_rgb}`}
					alt="Original Image"
				/>
			</div>
			<div>
				<h3>Green Objects Detection</h3>
				<img
					src={`data:image/png;base64,${results.result}`}
					alt="Green Objects Detection"
				/>
			</div>
			{results.cropped_images.map((image, index) => (
				<div key={index}>
					<h3>Detected Object {index}</h3>
					<img
						src={`data:image/png;base64,${image}`}
						alt={`Detected Object ${index}`}
					/>
					<p>Average HSV: {results.average_hsvs[index]}</p>
				</div>
			))}
			{results.selected_leaf_index !== null && (
				<div>
					<h3>Selected Leaf</h3>
					<img
						src={`data:image/png;base64,${
							results.cropped_images[results.selected_leaf_index]
						}`}
						alt="Selected Leaf"
					/>
					<p>
						Average HSV:{" "}
						{results.average_hsvs[results.selected_leaf_index]}
					</p>
				</div>
			)}
			{results.most_similar_index !== -1 && (
				<div>
					<h3>Most Similar Object</h3>
					<img
						src={`data:image/png;base64,${
							results.cropped_images[results.most_similar_index]
						}`}
						alt="Most Similar Object"
					/>
					<p>
						Average HSV:{" "}
						{results.average_hsvs[results.most_similar_index]}
					</p>
				</div>
			)}
		</div>
	);
};

export default LeafResults;

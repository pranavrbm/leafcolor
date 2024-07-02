import axios from "axios";

const API_URL = "http://localhost:8000/api/leaf_images/";

const uploadImage = (formData) => {
	return axios.post(API_URL, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};

const processImage = (id) => {
	return axios.post(`${API_URL}${id}/process_image/`);
};

export { uploadImage, processImage };

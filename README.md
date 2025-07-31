# LeafColor

LeafColor is a project designed to analyze the color of leaves from images, with the specific goal of detecting, segmenting, and comparing leaf colors using reference charts and image processing techniques. This tool is ideal for plant biologists, agricultural researchers, or hobbyists who want to automate the assessment of leaf color for health, classification, or research purposes.

## Project Overview

LeafColor combines Python (with OpenCV and Pillow for image processing), a web frontend (JavaScript/React), and various scientific libraries to create an end-to-end pipeline for:

- **Uploading and processing leaf images**
- **Detecting green objects (leaves) in photographs**
- **Segmenting and cropping leaf areas**
- **Calculating average RGB color values for individual leaves**
- **Comparing leaf colors to reference charts or other objects**
- **Normalizing color data to account for lighting and background effects**

## Features

- **Leaf Detection & Segmentation:** Uses image processing to identify and isolate leaf regions from uploaded images.
- **Color Analysis:** Computes the average RGB color of detected leaves, removing lighting artifacts and normalizing against background black/white regions.
- **Comparison Engine:** Compares the color of the selected leaf to a set of reference images, displaying similarity percentages and visual matches.
- **Interactive Frontend:** Allows users to upload images, view detected leaves, select a leaf for analysis, and review detailed color data and comparisons.
- **Visual Feedback:** Cropped images, processed data, and comparison results are displayed directly in the web interface.

## How It Works

1. **Upload an Image:** Users can upload a photo containing leaves via the web app.
2. **Leaf Segmentation:** The backend uses OpenCV to segment green objects (leaves) and isolate them from the image.
3. **Background Normalization:** The system detects black and white background regions to correct for lighting variations.
4. **Color Calculation:** For each segmented leaf, the average RGB color is computed.
5. **Comparison:** The processed leaf color is compared against a set of reference images, showing the closest match and similarity score.
6. **Visualization:** Results, including cropped leaf images, average colors, and comparison tables, are displayed interactively.

## Example Workflow

1. Upload a leaf image.
2. The system segments all green objects and displays cropped leaf images.
3. Select a leaf to analyze; its average RGB is calculated.
4. The selected leaf is compared with other reference objects; similarity scores and images are displayed.
5. Review processed data and download results as needed.

## Technologies Used

- **Python** (main backend, image processing)
- **OpenCV, Pillow** (image analysis)
- **Django REST API** (backend communication)
- **React, JavaScript** (frontend interface)
- **Cython, C, C++** (performance optimization in some routines)
- **Matplotlib, SciPy** (scientific computation)
- **HTML/CSS** (web interface elements)

## Code Structure

- `model2/views.py`: Core logic for image upload, segmentation, RGB calculation, background normalization, and result packaging.
- `frontend/src/pages/Profile.js`: Handles frontend logic for image upload, displaying processed results, and user interactions.
- `venv/Lib/site-packages/`: Contains scientific libraries for color and clustering analysis (used in backend).

## How to Run the Project

### Prerequisites

- Python 3.8+ installed
- Node.js and npm installed (for frontend)
- (Recommended) Use a virtual environment for Python

### Backend Setup (Django + API)

1. **Clone the repository:**
    ```bash
    git clone https://github.com/pranavrbm/leafcolor.git
    cd leafcolor
    ```

2. **Create and activate a Python virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3. **Install backend dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4. **Run migrations (if using Django ORM):**
    ```bash
    python manage.py migrate
    ```

5. **Start the backend server:**
    ```bash
    python manage.py runserver
    ```
    By default, the backend runs on `http://localhost:8000/`.

### Frontend Setup (React)

1. **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2. **Install frontend dependencies:**
    ```bash
    npm install
    ```

3. **Start the frontend development server:**
    ```bash
    npm start
    ```
    By default, the frontend runs on `http://localhost:3000/`.

### Using the App

- Open [http://localhost:3000/](http://localhost:3000/) in your browser.
- Upload a leaf image, select a leaf, and view color analysis results.

### Notes

- The backend must be running for the frontend to communicate with the API.
- You may need to configure CORS in the backend for local development.
- Make sure all dependencies are installed as required in `requirements.txt` and `package.json`.

## Why LeafColor?

This project automates and standardizes leaf color analysis, making it easy to compare, document, and research plant health or species. Its core innovation is the normalization and segmentation pipeline, ensuring robust results regardless of lighting or background.

## License

Currently, this project does not specify a license. Please contact the project owner for usage details.

## Author

[pranavrbm](https://github.com/pranavrbm)

---

*If you have forgotten what this project does: LeafColor helps you upload images of leaves, segments them, analyzes their color, and compares them to reference charts to automate and visualize leaf color classification and assessment.*

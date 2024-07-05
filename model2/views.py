# leaf_app/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
import cv2
import numpy as np
from PIL import Image

class LeafImageUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    levels = {
        'level 1': np.array([174, 249, 101]),
        'level 2': np.array([133, 204, 64]),
        'level 3': np.array([104, 168, 42]),
        'level 4': np.array([64, 115, 15]),
        'level 5': np.array([33, 62, 5]),
    }

    def euclidean_distance(self, rgb1, rgb2):
        return np.sqrt(np.sum((rgb1 - rgb2) ** 2))

    def categorize_rgb(self, rgb):
        distances = {level: self.euclidean_distance(rgb, value) for level, value in self.levels.items()}
        min_level = min(distances, key=distances.get)
        threshold = 50
        if distances[min_level] > threshold:
            if np.all(rgb > self.levels['level 1']):
                return "below level 1"
            elif np.all(rgb < self.levels['level 5']):
                return "above level 5"
        return min_level

    def segment_color(self, image, lower_bound, upper_bound):
        hsv_image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        mask = cv2.inRange(hsv_image, lower_bound, upper_bound)
        return mask

    def calculate_average_color(self, image, mask):
        masked_image = cv2.bitwise_and(image, image, mask=mask)
        non_zero_pixels = masked_image[mask != 0].reshape(-1, 3)
        if non_zero_pixels.size == 0:
            return np.array([0, 0, 0])
        avg_color = np.mean(non_zero_pixels, axis=0)
        return avg_color

    def normalize_leaf_color(self, leaf_region, avg_black, avg_white):
        normalized_leaf = np.clip((leaf_region - avg_black) / (avg_white - avg_black) * 255, 0, 255)
        return normalized_leaf.astype(np.uint8)

    def calculate_leaf_rgb(self, leaf_region):
        leaf_pixels = leaf_region[leaf_region != 0].reshape(-1, 3)
        avg_leaf_color = np.mean(leaf_pixels, axis=0)
        return avg_leaf_color

    def process_leaf_image(self, image):
        image = Image.open(image)
        image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        leaf_mask = self.segment_color(image, (30, 40, 35), (85, 255, 255))
        black_mask = self.segment_color(image, (0, 0, 0), (180, 255, 30))
        white_mask = self.segment_color(image, (0, 0, 200), (180, 25, 255))
        avg_black = self.calculate_average_color(image, black_mask)
        avg_white = self.calculate_average_color(image, white_mask)
        leaf_region = cv2.bitwise_and(image, image, mask=leaf_mask)
        normalized_leaf = self.normalize_leaf_color(leaf_region, avg_black, avg_white)
        avg_leaf_color = self.calculate_leaf_rgb(normalized_leaf)
        category = self.categorize_rgb(avg_leaf_color)
        return {"actual_rgb_value": avg_leaf_color.tolist(), "category": category}

    def post(self, request, *args, **kwargs):
        if 'image' not in request.data:
            return Response({"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        image = request.data['image']
        result = self.process_leaf_image(image)
        return Response(result)

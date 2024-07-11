import cv2
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image
import base64
from io import BytesIO
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from .models import LeafImageResult

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
        non_zero_pixels = masked_image[mask != 0]
        if non_zero_pixels.size == 0:
            return np.array([0, 0, 0])
        non_zero_pixels = non_zero_pixels.reshape(-1, 3)
        avg_color = np.mean(non_zero_pixels, axis=0)
        return avg_color

    def remove_light_effect(self, image, black_background_avg, white_background_avg):
        normalized_image = np.zeros_like(image, dtype=np.float32)
        for channel in range(3):  # Iterate over RGB channels
            normalized_image[:,:,channel] = np.clip(
                (image[:,:,channel] - black_background_avg[channel]) / (white_background_avg[channel] - black_background_avg[channel]) * 255,
                0, 255
            )
        normalized_image = normalized_image.astype(np.uint8)
        return normalized_image

    def calculate_leaf_rgb(self, leaf_region):
        leaf_pixels = leaf_region[leaf_region.any(axis=2)]
        if leaf_pixels.size == 0 or leaf_pixels.size % 3 != 0:
            return np.array([0, 0, 0])
        leaf_pixels = leaf_pixels.reshape(-1, 3)
        avg_leaf_color = np.mean(leaf_pixels, axis=0)
        return avg_leaf_color

    def process_leaf_image(self, image):
        image = Image.open(image)
        image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        # Segment the leaf
        leaf_mask = self.segment_color(image, (30, 40, 35), (85, 255, 255))
        
        # Segment the black and white regions
        black_mask = self.segment_color(image, (0, 0, 0), (180, 255, 100))
        white_mask = self.segment_color(image, (0, 0, 100), (255, 255, 255))
        
        # Calculate background colors
        avg_black = self.calculate_average_color(image, black_mask)
        avg_white = self.calculate_average_color(image, white_mask)
        
        # Remove lighting effects on the leaf region
        normalized_leaf = self.remove_light_effect(image, avg_black, avg_white)
        
        # Apply the leaf mask to the normalized leaf region
        leaf_region = cv2.bitwise_and(normalized_leaf, normalized_leaf, mask=leaf_mask)
        
        # Calculate and categorize the leaf RGB value
        avg_leaf_color = self.calculate_leaf_rgb(leaf_region)
        category = self.categorize_rgb(avg_leaf_color)

        # Encode the detected green object image to base64
        _, buffer = cv2.imencode('.jpg', leaf_region)
        green_object_image = base64.b64encode(buffer).decode('utf-8')

        return {"actual_rgb_value": avg_leaf_color.tolist(), "category": category, "green_object_image": green_object_image}

    def post(self, request, *args, **kwargs):
        if 'image' not in request.data:
            return Response({"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        image = request.data['image']
        result = self.process_leaf_image(image)

        # Save result to database
        LeafImageResult.objects.create(
            actual_rgb_value=result['actual_rgb_value'],
            category=result['category'],
            green_object_image=result['green_object_image']
        )

        return Response(result)

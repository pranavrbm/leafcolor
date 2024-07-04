import cv2
import numpy as np
from scipy.spatial.distance import euclidean
from django.core.files.storage import default_storage
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from .serializers import ImageUploadSerializer
import logging
import base64

logger = logging.getLogger(__name__)

def calculate_average_rgb(image, mask):
    masked_image = cv2.bitwise_and(image, image, mask=mask)
    average_rgb = cv2.mean(masked_image, mask=mask)[:3]
    # Round average RGB values to 2 decimal places
    average_rgb = [round(value, 2) for value in average_rgb]
    return list(average_rgb)
# Convert tuple to list

def image_to_base64(image):
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)  # Convert BGR to RGB
    _, buffer = cv2.imencode('.jpg', image_rgb)
    return base64.b64encode(buffer).decode('utf-8')

class ProcessImageView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        serializer = ImageUploadSerializer(data=request.data)
        if serializer.is_valid():
            try:
                image_file = serializer.validated_data['image']
                selected_leaf_index = serializer.validated_data.get('selected_leaf_index')

                logger.debug(f"Received image file: {image_file.name}")

                file_path = default_storage.save(image_file.name, image_file)
                image_path = default_storage.path(file_path)

                logger.debug(f"Saved image to: {image_path}")

                image = cv2.imread(image_path)
                if image is None:
                    logger.error("Failed to read image")
                    return Response({"error": "Failed to read image"}, status=status.HTTP_400_BAD_REQUEST)

                image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
                hsv_image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

                lower_green = np.array([30, 40, 35])
                upper_green = np.array([85, 255, 255])
                mask = cv2.inRange(hsv_image, lower_green, upper_green)
                result = cv2.bitwise_and(image_rgb, image_rgb, mask=mask)
                contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

                cropped_images = []
                average_rgbs = []
                aspect_ratios = []
                bounding_boxes = []

                logger.debug(f"Found {len(contours)} contours")

                for contour in contours:
                    area = cv2.contourArea(contour)
                    if area > 1000:
                        x, y, w, h = cv2.boundingRect(contour)
                        aspect_ratio = float(w) / h
                        aspect_ratios.append(aspect_ratio)
                        cropped_image = image_rgb[y:y+h, x:x+w]
                        cropped_mask = mask[y:y+h, x:x+w]
                        cropped_result = cv2.bitwise_and(cropped_image, cropped_image, mask=cropped_mask)

                        if np.any(cropped_mask):
                            cropped_images.append(image_to_base64(cropped_result))  # Encode cropped image as base64
                            bounding_boxes.append((x, y, w, h))
                            avg_rgb = calculate_average_rgb(image_rgb[y:y+h, x:x+w], cropped_mask)
                            average_rgbs.append(avg_rgb)

                logger.debug(f"Processed {len(cropped_images)} cropped images")

                comparison_results = []

                if selected_leaf_index is not None and 0 <= selected_leaf_index < len(cropped_images):
                    leaf_rgb = average_rgbs[selected_leaf_index]
                    min_distance = float('inf')
                    most_similar_index = -1

                    for i, avg_rgb in enumerate(average_rgbs):
                        if i != selected_leaf_index:
                            distance = euclidean(leaf_rgb, avg_rgb)
                            similarity = 100 - (distance / np.sqrt(sum([x**2 for x in leaf_rgb])) * 100)
                            comparison_results.append({
                                "index": i,
                                "similarity": round(similarity, 2),
                                "average_rgb": avg_rgb,
                                "bounding_box": bounding_boxes[i],
                                "image": cropped_images[i]
                            })
                            if distance < min_distance:
                                min_distance = distance
                                most_similar_index = i

                    comparison_results.sort(key=lambda x: x['similarity'], reverse=True)

                    if most_similar_index != -1:
                        result_data = {
                            "selected_leaf_index": selected_leaf_index,
                            "selected_leaf": cropped_images[selected_leaf_index],
                            "most_similar_index": most_similar_index,
                            "most_similar_rgb": average_rgbs[most_similar_index],
                            "bounding_box": bounding_boxes[most_similar_index],
                            "most_similar_image": cropped_images[most_similar_index],
                            "comparison_results": comparison_results,
                            "leaf_rgb": leaf_rgb
                        }
                        logger.debug(f"Most similar object index: {most_similar_index}")
                        return Response(result_data, status=status.HTTP_200_OK)

                return Response({
                    "original_image": image_to_base64(image),  # Encode original image as base64
                    "green_objects_image": image_to_base64(result),  # Encode green objects image as base64
                    "cropped_images": cropped_images,
                    "average_rgbs": average_rgbs,
                    "bounding_boxes": bounding_boxes,
                    "comparison_results": comparison_results
                }, status=status.HTTP_200_OK)

            except Exception as e:
                logger.exception("Error processing image")
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        logger.error("Invalid serializer data")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

import cv2
import numpy as np

def calculate_average_hsv(image, mask):
    hsv_image = cv2.cvtColor(image, cv2.COLOR_RGB2HSV)
    masked_hsv = cv2.bitwise_and(hsv_image, hsv_image, mask=mask)
    average_hsv = cv2.mean(masked_hsv, mask=mask)[:3]
    return average_hsv

def process_image(image_path):
    image = cv2.imread(image_path)
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    hsv_image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    lower_green = np.array([30, 40, 35])
    upper_green = np.array([85, 255, 255])
    mask = cv2.inRange(hsv_image, lower_green, upper_green)
    result = cv2.bitwise_and(image_rgb, image_rgb, mask=mask)
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cropped_images = []
    average_hsvs = []
    bounding_boxes = []

    for contour in contours:
        area = cv2.contourArea(contour)
        if area > 1000:
            x, y, w, h = cv2.boundingRect(contour)
            cropped_image = image_rgb[y:y+h, x:x+w]
            cropped_mask = mask[y:y+h, x:x+w]
            if np.any(cropped_mask):
                cropped_images.append(cropped_image)
                bounding_boxes.append((x, y, w, h))
                avg_hsv = calculate_average_hsv(image_rgb[y:y+h, x:x+w], cropped_mask)
                average_hsvs.append(avg_hsv)

    return {
        'bounding_boxes': bounding_boxes,
        'average_hsvs': average_hsvs
    }

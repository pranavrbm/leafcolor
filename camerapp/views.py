from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.base import ContentFile
from PIL import Image
import io
import base64

from .models import UploadedImage
from .serializers import UploadedImageSerializer

class ImageUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        serializer = UploadedImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            image_path = serializer.data['image']
            image = Image.open(image_path[1:])  # Remove leading slash from the path

            # Crop the image (example: crop to center square)
            width, height = image.size
            new_size = min(width, height)
            left = (width - new_size) / 2
            top = (height - new_size) / 2
            right = (width + new_size) / 2
            bottom = (height + new_size) / 2
            cropped_image = image.crop((left, top, right, bottom))

            # Save cropped image to memory
            buffer = io.BytesIO()
            cropped_image.save(buffer, format='JPEG')
            cropped_image_file = ContentFile(buffer.getvalue(), 'cropped_image.jpg')

            # Convert to base64 for returning to the frontend
            cropped_image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')

            return Response({'cropped_image': cropped_image_base64}, status=200)
        return Response(serializer.errors, status=400)

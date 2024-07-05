
# leaf_app/urls.py
from django.urls import path
from .views import LeafImageUploadView

urlpatterns = [
    path('upload/', LeafImageUploadView.as_view(), name='leaf_image_upload'),
]

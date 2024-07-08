# leaf_app/models.py
from django.db import models

class LeafImageResult(models.Model):
    actual_rgb_value = models.JSONField()
    category = models.CharField(max_length=50)
    green_object_image = models.TextField()

    def __str__(self):
        return f"Leaf Image Result - Category: {self.category}"

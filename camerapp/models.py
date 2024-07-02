from django.db import models

class ImageUpload(models.Model):
    image = models.ImageField(upload_to='upload/')
    name = models.TextField(default="leaf image")
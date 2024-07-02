from rest_framework import serializers

class ImageUploadSerializer(serializers.Serializer):
    image = serializers.ImageField()
    selected_leaf_index = serializers.IntegerField(required=False)

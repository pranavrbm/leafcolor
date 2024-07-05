# leaf_app/serializers.py
from rest_framework import serializers

class LeafImageSerializer(serializers.Serializer):
    image = serializers.ImageField()

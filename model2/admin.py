# leaf_app/admin.py
from django.contrib import admin
from .models import LeafImageResult

@admin.register(LeafImageResult)
class LeafImageResultAdmin(admin.ModelAdmin):
    list_display = ('category', 'actual_rgb_value')

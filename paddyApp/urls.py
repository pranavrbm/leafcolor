# from django.conf import settings
# from django.conf.urls.static import static
# from django.contrib import admin
# from django.urls import path, include
# from .views import index
# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('api/', include('camerapp.urls')),
#     path('', index),
#     # path('Camera/', include('camerapp.urls')),
# ]


from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from .views import index

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('processing.urls')),
    path('Home/', include('model2.urls')),
    path('', index),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

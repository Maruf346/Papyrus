from rest_framework.routers import DefaultRouter # type: ignore
from paper.views import *
from django.urls import path, include


router = DefaultRouter()
router.register(r'papers', PaperViewSet, basename='paper')
router.register(r'user-uploads', UserUploadViewSet, basename='userupload')

urlpatterns = [
    path('', include(router.urls)),        
]

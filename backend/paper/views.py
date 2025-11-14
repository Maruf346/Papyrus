from rest_framework import viewsets # type: ignore
from .models import *
from .serializers import *

class PaperViewSet(viewsets.ModelViewSet):
    queryset = Paper.objects.all().order_by('-created_at')
    serializer_class = PaperSerializer
    search_fields = ['title', 'authors', 'abstract', 'categories', 'journal_ref']
    ordering_fields = ['publication_year', 'created_at']

class UserUploadViewSet(viewsets.ModelViewSet):
    queryset = UserUpload.objects.all().order_by('-created_at')
    serializer_class = UserUploadSerializer
    search_fields = ['title', 'authors', 'abstract', 'categories']
    ordering_fields = ['created_at']

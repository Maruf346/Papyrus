from rest_framework import serializers # type: ignore
from .models import *

class PaperSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paper
        fields = '__all__'  
        read_only_fields = ['id', 'created_at', 'updated_at', 'paper_id', 'embedding']

class PaperListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paper
        fields = [
            "paper_id",
            "title",
            "authors",
            "abstract",
            "categories",
            "journal_ref",
            "doi",
            "publication_year",
        ]


class UserUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserUpload
        fields = [
            'id',
            'upload_id',
            'title',
            'authors',
            'abstract',
            'categories',
            'created_at',
        ]  
        read_only_fields = ['id', 'created_at', 'upload_id']

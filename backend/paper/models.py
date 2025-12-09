from django.db import models
import uuid


class Paper(models.Model):
    paper_id = models.CharField(max_length=50, unique=True)  # arXiv ID 
    title = models.CharField(max_length=500)
    authors = models.TextField()
    abstract = models.TextField()
    categories = models.CharField(max_length=200, null=True, blank=True)
    journal_ref = models.CharField(max_length=255, null=True, blank=True)
    doi = models.CharField(max_length=255, null=True, blank=True)
    publication_year = models.IntegerField(null=True, blank=True)
    embedding = models.JSONField(null=True, blank=True)   # vector representation
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class UserUpload(models.Model):
    upload_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    title = models.CharField(max_length=500, blank=True, null=True)
    authors = models.TextField(blank=True, null=True)
    abstract = models.TextField()
    categories = models.CharField(max_length=200, blank=True, null=True)
    embedding = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title or f"User Upload {self.upload_id}"

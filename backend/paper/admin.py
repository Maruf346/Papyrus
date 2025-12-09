from django.contrib import admin
from .models import *

@admin.register(Paper)
class PaperAdmin(admin.ModelAdmin):
    list_display = ("paper_id", "title", "publication_year", "categories")
    search_fields = ("title", "authors", "abstract")
    list_filter = ("publication_year", "categories")

@admin.register(UserUpload)
class UserUploadAdmin(admin.ModelAdmin):
    list_display = ("upload_id", "title", "created_at")
    search_fields = ("title", "abstract")
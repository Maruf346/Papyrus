from django.apps import AppConfig
import os


class PaperConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'paper'

    def ready(self):
        if os.environ.get("RUN_MAIN") == "true":
            from paper.utils.faiss_index import build_faiss_index
            build_faiss_index()

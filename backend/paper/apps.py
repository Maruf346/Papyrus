from django.apps import AppConfig


class PaperConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'paper'

    def ready(self):
        from paper.utils.faiss_index import build_faiss_index
        build_faiss_index()

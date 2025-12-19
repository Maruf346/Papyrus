from rest_framework import viewsets # type: ignore
from .models import *
from .serializers import *
from rest_framework.decorators import action # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore
# from .utils import generate_embedding, get_similar_papers
from paper.utils.embeddings import generate_embedding
from paper.utils.faiss_index import search_similar_papers


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

    @action(detail=False, methods=['post'])
    def recommend(self, request):
        # Generates embedding for uploaded abstract,
        # finds similar papers, and returns recommendations.
        
        abstract = request.data.get("abstract")

        if not abstract:
            return Response({"error": "abstract is required"}, status=400)

        # Step 1: create user upload entry
        user_upload = UserUpload.objects.create(
            abstract=abstract,
            title=request.data.get("title", None),
            authors=request.data.get("authors", None),
            categories=request.data.get("categories", None),
        )

        # Step 2: generate embedding
        embedding = generate_embedding(abstract)
        user_upload.embedding = embedding
        user_upload.save()

        # Step 3: find similar papers
        # similar = get_similar_papers(embedding, top_n=10)
        
        # Using FAISS for similarity search
        similar = search_similar_papers(embedding, top_n=10)

        # Step 4: fetch Paper objects & attach similarity scores
        papers = []
        for item in similar:
            p = Paper.objects.filter(id=item["paper_id"]).first()
            if p:
                paper_data = PaperListSerializer(p).data
                paper_data["similarity"] = item["score"]
                papers.append(paper_data)

        return Response({
            "user_upload_id": str(user_upload.upload_id),
            "results": papers
        }, status=200)

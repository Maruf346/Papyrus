from rest_framework import viewsets # type: ignore
from .models import *
from .serializers import *
from rest_framework.decorators import action # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore
# from .utils import generate_embedding, get_similar_papers
from paper.utils.embeddings import generate_embedding
from paper.utils.faiss_index import search_similar_papers
from django.db.models import Q
from django.db.models import Count


class PaperViewSet(viewsets.ModelViewSet):
    queryset = Paper.objects.all().order_by('-created_at')
    serializer_class = PaperSerializer
    search_fields = ['title', 'authors', 'abstract', 'categories', 'journal_ref']
    ordering_fields = ['publication_year', 'created_at']
    
    @action(detail=False, methods=["get"])
    def search(self, request):
        query = request.query_params.get("q")
        top_n = int(request.query_params.get("top_n", 10))

        if not query:
            return Response({"error": "q parameter is required"}, status=400)

        # Step 1: semantic search (FAISS)
        query_embedding = generate_embedding(query)
        semantic_results = search_similar_papers(query_embedding, top_n=top_n * 2)

        semantic_ids = [item["paper_id"] for item in semantic_results]

        # Step 2: keyword filtering
        keyword_qs = Paper.objects.filter(
            Q(title__icontains=query) |
            Q(abstract__icontains=query)
        )

        # Step 3: merge IDs (semantic + keyword)
        combined_ids = set(semantic_ids) | set(
            keyword_qs.values_list("id", flat=True)
        )

        papers = Paper.objects.filter(id__in=combined_ids)[:top_n]

        serializer = PaperListSerializer(papers, many=True)

        return Response({
            "query": query,
            "count": len(serializer.data),
            "results": serializer.data
        })
    
    @action(detail=False, methods=["get"])
    def trends(self, request):
        qs = (
            Paper.objects
            .exclude(publication_year__isnull=True)
            .exclude(categories__isnull=True)
            .values("categories", "publication_year")
            .annotate(count=Count("id"))
            .order_by("categories", "publication_year")
        )

        trends = {}

        for row in qs:
            category = row["categories"]
            year = row["publication_year"]
            count = row["count"]

            if category not in trends:
                trends[category] = {}

            trends[category][year] = count

        return Response(trends)




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

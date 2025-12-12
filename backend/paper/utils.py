import numpy as np
from sentence_transformers import SentenceTransformer # type: ignore
from sklearn.metrics.pairwise import cosine_similarity
from .models import Paper

# Load model once when Django starts (fast)
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

def generate_embedding(text):
    return model.encode(text).tolist()

def get_similar_papers(user_embedding, top_n=10):
    # Convert to array for cosine similarity
    user_vec = np.array(user_embedding).reshape(1, -1)

    papers = Paper.objects.exclude(embedding__isnull=True)
    if not papers.exists():
        return []

    paper_embeddings = []
    paper_ids = []

    for paper in papers:
        paper_embeddings.append(paper.embedding)
        paper_ids.append(paper.id)

    paper_embeddings = np.array(paper_embeddings)

    scores = cosine_similarity(user_vec, paper_embeddings)[0]

    # Sort by similarity score
    sorted_idx = np.argsort(scores)[::-1]  # descending order

    top_results = []
    for idx in sorted_idx[:top_n]:
        top_results.append({
            "paper_id": paper_ids[idx],
            "score": float(scores[idx])
        })

    return top_results

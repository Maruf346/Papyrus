import faiss # type: ignore
import numpy as np
from paper.models import Paper

# Global objects (loaded once)
index = None
paper_ids = []


def build_faiss_index():
    global index, paper_ids

    papers = Paper.objects.exclude(embedding__isnull=True).values("id", "embedding")

    if not papers.exists():
        print("No embeddings found.")
        return

    embeddings = []
    paper_ids = []

    for row in papers:
        embeddings.append(row["embedding"])
        paper_ids.append(row["id"])

    # Convert to numpy array
    vectors = np.array(embeddings).astype("float32")

    # Normalize vectors (for cosine similarity)
    faiss.normalize_L2(vectors)

    dim = vectors.shape[1]

    # Create FAISS index
    index = faiss.IndexFlatIP(dim)
    index.add(vectors)

    print(f"FAISS index built with {index.ntotal} vectors.")

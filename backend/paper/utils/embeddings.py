from sentence_transformers import SentenceTransformer # type: ignore
import numpy as np

# Load once
_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")


def generate_embedding(text: str):
    embedding = _model.encode(text)
    embedding = np.array(embedding).astype("float32")
    return embedding.tolist()

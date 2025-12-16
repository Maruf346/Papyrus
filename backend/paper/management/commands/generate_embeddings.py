from django.core.management.base import BaseCommand
from paper.models import Paper

from sentence_transformers import SentenceTransformer # type: ignore
import math


class Command(BaseCommand):
    help = "Generate embeddings for Paper abstracts in batches"

    def add_arguments(self, parser):
        parser.add_argument(
            "--batch_size",
            type=int,
            default=128,
            help="Number of papers to process per batch"
        )

    def handle(self, *args, **kwargs):
        batch_size = kwargs["batch_size"]

        self.stdout.write(self.style.SUCCESS("Loading embedding model..."))
        model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

        queryset = Paper.objects.filter(embedding__isnull=True)
        total = queryset.count()

        if total == 0:
            self.stdout.write(self.style.WARNING("No papers left without embeddings."))
            return

        self.stdout.write(self.style.SUCCESS(f"Total papers to process: {total}"))

        total_batches = math.ceil(total / batch_size)

        for batch_num in range(total_batches):
            start = batch_num * batch_size
            end = start + batch_size

            papers = list(queryset[start:end])

            abstracts = [p.abstract for p in papers]

            # Generate embeddings
            embeddings = model.encode(
                abstracts,
                batch_size=batch_size,
                show_progress_bar=False
            )

            # Save embeddings
            for paper, embedding in zip(papers, embeddings):
                paper.embedding = embedding.tolist()
                paper.save(update_fields=["embedding"])

            self.stdout.write(
                f"Batch {batch_num + 1}/{total_batches} completed "
                f"({end if end < total else total}/{total})"
            )

        self.stdout.write(self.style.SUCCESS("Embedding generation completed!"))

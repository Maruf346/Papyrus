import json
from datetime import datetime

from django.core.management.base import BaseCommand
from paper.models import Paper


class Command(BaseCommand):
    help = "Ingest arXiv JSON dataset into Paper model"

    def add_arguments(self, parser):
        parser.add_argument(
            "file_path",
            type=str,
            help="Path to the arXiv JSON file"
        )

    def handle(self, *args, **kwargs):
        file_path = kwargs["file_path"]
        created_count = 0
        skipped_count = 0

        self.stdout.write(self.style.SUCCESS("Starting arXiv ingestion..."))

        with open(file_path, "r", encoding="utf-8") as file:
            for line_number, line in enumerate(file, start=1):
                try:
                    data = json.loads(line)

                    paper_id = data.get("id")
                    title = data.get("title", "").strip()
                    authors = data.get("authors", "").strip()
                    abstract = data.get("abstract", "").strip()
                    categories = data.get("categories")
                    journal_ref = data.get("journal-ref")
                    doi = data.get("doi")

                    # Skip if essential fields are missing
                    if not paper_id or not abstract or not title:
                        skipped_count += 1
                        continue

                    # Extract publication year from versions
                    publication_year = None
                    versions = data.get("versions", [])
                    if versions:
                        created_date = versions[0].get("created")
                        try:
                            publication_year = datetime.strptime(
                                created_date, "%a, %d %b %Y %H:%M:%S %Z"
                            ).year
                        except Exception:
                            publication_year = None

                    # Avoid duplicates
                    if Paper.objects.filter(paper_id=paper_id).exists():
                        skipped_count += 1
                        continue

                    Paper.objects.create(
                        paper_id=paper_id,
                        title=title,
                        authors=authors,
                        abstract=abstract,
                        categories=categories,
                        journal_ref=journal_ref,
                        doi=doi,
                        publication_year=publication_year,
                    )

                    created_count += 1

                    # Progress output every 1000 records
                    if created_count % 1000 == 0:
                        self.stdout.write(
                            f"{created_count} papers ingested..."
                        )

                except json.JSONDecodeError:
                    skipped_count += 1
                except Exception as e:
                    skipped_count += 1
                    self.stderr.write(
                        f"Error at line {line_number}: {str(e)}"
                    )

        self.stdout.write(self.style.SUCCESS("Ingestion completed!"))
        self.stdout.write(f"Total inserted: {created_count}")
        self.stdout.write(f"Total skipped: {skipped_count}")

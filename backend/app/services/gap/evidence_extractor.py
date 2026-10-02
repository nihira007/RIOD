from __future__ import annotations

from app.models.schemas import Paper


class EvidenceExtractor:
    """
    Extracts structured evidence from
    retrieved literature.
    """

    def compute(
        self,
        papers: list[Paper],
    ) -> dict:

        evidence = []

        for paper in papers:

            evidence.append({

                "title": paper.title,

                "abstract": paper.abstract,

                "authors": paper.authors,

                "year": paper.year,

                "citations": paper.citations,

                "venue": getattr(paper, "venue", None),

            })

        return {

            "count": len(evidence),

            "evidence": evidence,

            "reasoning":
                "Structured evidence extracted from retrieved literature."

        }
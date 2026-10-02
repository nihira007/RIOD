from __future__ import annotations

from statistics import mean, median

from app.models.schemas import Paper


class CitationDensity:
    """
    Computes citation-based saturation metrics.

    High citation density usually indicates
    a mature and well-established research area.
    """

    HIGHLY_CITED_THRESHOLD = 100

    def compute(
        self,
        papers: list[Paper],
    ) -> dict:

        if not papers:

            return {

                "score": 0,

                "average_citations": 0,

                "median_citations": 0,

                "max_citations": 0,

                "highly_cited_ratio": 0,

                "reasoning": "No citation data available."

            }

        citations = [

            p.citations or 0

            for p in papers

        ]

        avg = mean(citations)

        med = median(citations)

        maximum = max(citations)

        highly_cited = sum(

            c >= self.HIGHLY_CITED_THRESHOLD

            for c in citations

        )

        highly_ratio = highly_cited / len(citations)

        ##################################################
        # Citation Score
        ##################################################

        avg_component = min(

            avg / 200,

            1,

        )

        high_component = highly_ratio

        score = (

            avg_component * 70

            +

            high_component * 30

        ) * 100

        score = max(

            0,

            min(

                score,

                100,

            ),

        )

        return {

            "score": round(score, 2),

            "average_citations": round(avg, 2),

            "median_citations": med,

            "max_citations": maximum,

            "highly_cited_ratio": round(

                highly_ratio,

                2,

            ),

            "reasoning":

                "Citation density estimated using average citation impact and highly cited paper ratio."

        }
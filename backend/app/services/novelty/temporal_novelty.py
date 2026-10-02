from __future__ import annotations

from datetime import datetime

from app.models.schemas import Paper


class TemporalNovelty:
    """
    Measures novelty based on the recency of
    similar research.

    Recent similar papers decrease novelty.
    Older literature increases novelty.
    """

    def compute(
        self,
        papers: list[Paper],
    ) -> dict:

        if not papers:

            return {
                "score": 100.0,
                "recent_papers": 0,
                "average_age": 0,
                "reasoning": "No related papers found."
            }

        current_year = datetime.now().year

        valid_years = [

            p.year

            for p in papers

            if p.year is not None

        ]

        if not valid_years:

            return {
                "score": 80.0,
                "recent_papers": 0,
                "average_age": 0,
                "reasoning": "Publication years unavailable."
            }

        average_age = sum(

            current_year - year

            for year in valid_years

        ) / len(valid_years)

        recent_papers = len(

            [

                year

                for year in valid_years

                if year >= current_year - 2

            ]

        )

        recent_ratio = recent_papers / len(valid_years)

        novelty = (

            average_age * 12

            - recent_ratio * 50

        )

        novelty = max(

            0,

            min(

                novelty,

                100,

            ),

        )

        return {

            "score": round(
                novelty,
                2,
            ),

            "average_age": round(
                average_age,
                2,
            ),

            "recent_papers": recent_papers,

            "reasoning":

                "Temporal novelty estimated from publication recency."

        }
from __future__ import annotations

from collections import Counter
from datetime import datetime

from app.models.schemas import Paper


class PublicationDensity:

    """
    Computes publication density statistics.

    Higher publication density generally indicates
    a more saturated research area.
    """

    def compute(
        self,
        papers: list[Paper],
    ) -> dict:

        if not papers:

            return {

                "score": 0,

                "total_papers": 0,

                "papers_per_year": 0,

                "recent_ratio": 0,

                "year_distribution": {},

                "reasoning": "No papers retrieved."

            }

        current_year = datetime.now().year

        year_counter = Counter()

        for paper in papers:

            if paper.year is not None:

                year_counter[paper.year] += 1

        total_papers = len(papers)

        years = sorted(year_counter.keys())

        if years:

            span = max(

                current_year - years[0] + 1,

                1,

            )

        else:

            span = 1

        papers_per_year = total_papers / span

        recent_papers = sum(

            count

            for year, count in year_counter.items()

            if year >= current_year - 3

        )

        recent_ratio = recent_papers / total_papers

        ###################################################
        # Density Score
        ###################################################

        density_score = (

            min(

                papers_per_year / 20,

                1,

            )

            * 70

            +

            recent_ratio * 30

        )

        density_score = max(

            0,

            min(

                density_score,

                100,

            ),

        )

        return {

            "score": round(

                density_score,

                2,

            ),

            "total_papers": total_papers,

            "papers_per_year": round(

                papers_per_year,

                2,

            ),

            "recent_ratio": round(

                recent_ratio,

                2,

            ),

            "year_distribution": dict(

                sorted(

                    year_counter.items()

                )

            ),

            "reasoning":

                "Publication density estimated from yearly publication frequency."

        }
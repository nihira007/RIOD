from __future__ import annotations

from collections import Counter
from datetime import datetime

from app.models.schemas import Paper


class PublicationTrend:
    """
    Analyzes publication trends over time.
    """

    def compute(
        self,
        papers: list[Paper],
    ) -> dict:

        if not papers:
            return {
                "score": 0,
                "growth_rate": 0,
                "recent_ratio": 0,
                "trend": "Unknown",
                "year_distribution": {},
                "reasoning": "No papers available."
            }

        current_year = datetime.now().year

        year_counter = Counter()

        for paper in papers:

            if paper.year:

                year_counter[paper.year] += 1

        years = sorted(year_counter.keys())

        if len(years) < 2:

            return {

                "score": 50,

                "growth_rate": 0,

                "recent_ratio": 0,

                "trend": "Stable",

                "year_distribution": dict(year_counter),

                "reasoning": "Insufficient publication history."

            }

        ##################################################

        total = len(papers)

        recent = sum(

            count

            for year, count in year_counter.items()

            if year >= current_year - 3

        )

        recent_ratio = recent / total

        first = year_counter[years[0]]

        last = year_counter[years[-1]]

        growth_rate = (

            (last - first)

            / max(first, 1)

        ) * 100

        ##################################################

        score = (

            min(

                growth_rate / 300,

                1,

            ) * 60

            +

            recent_ratio * 40

        ) * 100

        score = max(

            0,

            min(

                score,

                100,

            ),

        )

        ##################################################

        if score > 80:

            trend = "Explosive"

        elif score > 60:

            trend = "Growing"

        elif score > 40:

            trend = "Stable"

        else:

            trend = "Declining"

        ##################################################

        return {

            "score": round(score, 2),

            "growth_rate": round(growth_rate, 2),

            "recent_ratio": round(recent_ratio, 2),

            "trend": trend,

            "year_distribution": dict(

                sorted(

                    year_counter.items()

                )

            ),

            "reasoning":

                "Publication trend estimated from yearly publication growth."

        }
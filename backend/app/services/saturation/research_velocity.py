from __future__ import annotations

from collections import Counter
from datetime import datetime

from app.models.schemas import Paper


class ResearchVelocity:
    """
    Estimates how quickly a research field
    is evolving based on publication trends.
    """

    def compute(
        self,
        papers: list[Paper],
    ) -> dict:

        if not papers:

            return {

                "score": 0,

                "growth_rate": 0,

                "acceleration": 0,

                "cagr": 0,

                "trend": "Unknown",

                "year_distribution": {},

                "reasoning": "No publication history available."

            }

        current_year = datetime.now().year

        year_counter = Counter()

        for paper in papers:

            if paper.year is not None:

                year_counter[paper.year] += 1

        years = sorted(year_counter.keys())

        if len(years) < 2:

            return {

                "score": 50,

                "growth_rate": 0,

                "acceleration": 0,

                "cagr": 0,

                "trend": "Insufficient Data",

                "year_distribution": dict(year_counter),

                "reasoning": "Not enough years to estimate velocity."

            }

        ##################################################
        # Growth Rate
        ##################################################

        first = year_counter[years[0]]

        last = year_counter[years[-1]]

        growth_rate = (

            (last - first)

            / max(first, 1)

        ) * 100

        ##################################################
        # CAGR
        ##################################################

        span = years[-1] - years[0]

        if span == 0:

            cagr = 0

        else:

            cagr = (

                (last / max(first, 1))

                ** (1 / span)

                - 1

            ) * 100

        ##################################################
        # Acceleration
        ##################################################

        yearly_counts = [

            year_counter[y]

            for y in years

        ]

        yearly_growth = []

        for i in range(1, len(yearly_counts)):

            yearly_growth.append(

                yearly_counts[i]

                - yearly_counts[i - 1]

            )

        acceleration = 0

        if len(yearly_growth) >= 2:

            acceleration = (

                yearly_growth[-1]

                -

                yearly_growth[0]

            )

        ##################################################
        # Velocity Score
        ##################################################

        score = (

            min(

                growth_rate / 300,

                1,

            ) * 40

            +

            min(

                cagr / 50,

                1,

            ) * 40

            +

            min(

                max(acceleration, 0) / 20,

                1,

            ) * 20

        )

        score = max(

            0,

            min(score, 100),

        )

        ##################################################

        if score > 80:

            trend = "Explosive"

        elif score > 60:

            trend = "Rapid"

        elif score > 40:

            trend = "Growing"

        elif score > 20:

            trend = "Stable"

        else:

            trend = "Slow"

        ##################################################

        return {

            "score": round(score, 2),

            "growth_rate": round(growth_rate, 2),

            "acceleration": round(acceleration, 2),

            "cagr": round(cagr, 2),

            "trend": trend,

            "year_distribution": dict(

                sorted(

                    year_counter.items()

                )

            ),

            "reasoning":

                "Research velocity estimated using publication growth, CAGR and acceleration."

        }
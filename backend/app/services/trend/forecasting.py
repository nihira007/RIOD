from __future__ import annotations

from collections import Counter

import numpy as np

from app.models.schemas import Paper


class TrendForecasting:
    """
    Forecast future publication trends using
    linear regression.
    """

    def compute(
        self,
        papers: list[Paper],
        years_to_predict: int = 3,
    ) -> dict:

        if not papers:

            return {

                "forecast": {},

                "slope": 0,

                "trend": "Unknown",

                "confidence": 0,

                "reasoning": "No publication history."

            }

        ##################################################

        counter = Counter()

        for paper in papers:

            if paper.year:

                counter[paper.year] += 1

        years = sorted(counter.keys())

        if len(years) < 2:

            return {

                "forecast": {},

                "slope": 0,

                "trend": "Stable",

                "confidence": 0.2,

                "reasoning": "Not enough years to forecast."

            }

        ##################################################

        x = np.array(years)

        y = np.array(

            [

                counter[year]

                for year in years

            ]

        )

        ##################################################

        slope, intercept = np.polyfit(

            x,

            y,

            1,

        )

        ##################################################

        predictions = {}

        last_year = years[-1]

        for i in range(

            1,

            years_to_predict + 1,

        ):

            future = last_year + i

            value = (

                slope * future

                + intercept

            )

            predictions[future] = max(

                0,

                round(

                    float(value),

                    1,

                ),

            )

        ##################################################

        y_pred = slope * x + intercept

        ss_res = np.sum(

            (y - y_pred) ** 2

        )

        ss_tot = np.sum(

            (y - np.mean(y)) ** 2

        )

        if ss_tot == 0:

            r2 = 1

        else:

            r2 = 1 - (

                ss_res / ss_tot

            )

        ##################################################

        if slope > 10:

            trend = "Explosive"

        elif slope > 5:

            trend = "Rapid"

        elif slope > 2:

            trend = "Growing"

        elif slope > 0:

            trend = "Stable"

        else:

            trend = "Declining"

        ##################################################

        return {

            "forecast": predictions,

            "slope": round(

                float(slope),

                2,

            ),

            "trend": trend,

            "confidence": round(

                max(

                    0,

                    min(

                        float(r2),

                        1,

                    ),

                ),

                3,

            ),

            "reasoning":

                "Forecast estimated using linear regression."

        }
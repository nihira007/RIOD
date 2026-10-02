from __future__ import annotations


class EmergingTopics:
    """
    Identifies emerging research topics by combining
    keyword evolution, topic evolution and forecasting.
    """

    def compute(
        self,
        keyword_evolution: dict,
        topic_evolution: dict,
        forecast: dict,
    ) -> dict:

        emerging = []

        ###################################################
        # Keyword Trends
        ###################################################

        for keyword, info in keyword_evolution[
            "all_keywords"
        ].items():

            growth = info["growth"]

            trend = info["trend"]

            if (

                trend == "Growing"

                and

                growth >= 5

            ):

                emerging.append(

                    {

                        "type": "Keyword",

                        "name": keyword,

                        "growth": growth,

                        "trend": trend,

                        "confidence": 0.80,

                    }

                )

        ###################################################
        # Topic Trends
        ###################################################

        for topic, info in topic_evolution[
            "topics"
        ].items():

            growth = info["growth"]

            trend = info["trend"]

            if (

                trend == "Growing"

                and

                growth >= 5

            ):

                emerging.append(

                    {

                        "type": "Topic",

                        "name": topic,

                        "growth": growth,

                        "trend": trend,

                        "confidence": 0.90,

                    }

                )

        ###################################################
        # Forecast
        ###################################################

        if forecast["forecast"]:

            future_growth = max(

                forecast["forecast"].values()

            )

        else:

            future_growth = 0

        ###################################################

        if future_growth > 100:

            market = "Explosive"

        elif future_growth > 60:

            market = "Rapid"

        elif future_growth > 20:

            market = "Growing"

        else:

            market = "Stable"

        ###################################################

        emerging = sorted(

            emerging,

            key=lambda x: x["growth"],

            reverse=True,

        )

        return {

            "emerging_topics":

                emerging[:20],

            "future_growth":

                future_growth,

            "future_trend":

                market,

            "reasoning":

                "Emerging topics estimated using keyword growth, topic evolution and publication forecasting."

        }
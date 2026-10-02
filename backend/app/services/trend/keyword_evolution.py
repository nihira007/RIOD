from __future__ import annotations

from collections import Counter, defaultdict

from app.models.schemas import Paper


class KeywordEvolution:
    """
    Tracks how research keywords evolve over time.
    """

    STOPWORDS = {

        "the",
        "and",
        "using",
        "based",
        "method",
        "methods",
        "approach",
        "study",
        "analysis",
        "paper",
        "research",
        "system",
        "results",
        "proposed",
        "new",
        "with",
        "for",
        "from",
        "into",

    }

    MIN_LENGTH = 3

    def compute(
        self,
        papers: list[Paper],
    ) -> dict:

        yearly_keywords = defaultdict(Counter)

        for paper in papers:

            if paper.year is None:

                continue

            text = (

                (paper.title or "")

                + " "

                + (paper.abstract or "")

            ).lower()

            words = text.split()

            for word in words:

                word = word.strip(".,()[]{}:;!?")

                if len(word) < self.MIN_LENGTH:

                    continue

                if word in self.STOPWORDS:

                    continue

                yearly_keywords[
                    paper.year
                ][word] += 1

        ####################################################

        evolution = {}

        all_keywords = set()

        for counter in yearly_keywords.values():

            all_keywords.update(counter.keys())

        ####################################################

        for keyword in sorted(all_keywords):

            timeline = {}

            years = sorted(yearly_keywords.keys())

            for year in years:

                timeline[year] = yearly_keywords[
                    year
                ].get(
                    keyword,
                    0,
                )

            values = list(timeline.values())

            growth = values[-1] - values[0]

            if growth > 5:

                trend = "Growing"

            elif growth < -5:

                trend = "Declining"

            else:

                trend = "Stable"

            evolution[keyword] = {

                "timeline": timeline,

                "growth": growth,

                "trend": trend,

            }

        ####################################################

        ranked = sorted(

            evolution.items(),

            key=lambda x: x[1]["growth"],

            reverse=True,

        )

        return {

            "top_growing": ranked[:20],

            "all_keywords": evolution,

            "reasoning":

                "Keyword evolution estimated from yearly keyword frequency."

        }
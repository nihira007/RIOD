from collections import Counter

from app.models.schemas import (
    Paper,
    ResearchUnderstanding,
)


class ApplicationNovelty:
    """
    Measures how novel the application
    area of the proposed research is.
    """

    def compute(

        self,

        understanding: ResearchUnderstanding,

        papers: list[Paper],

    ) -> dict:

        application = understanding.application_area.lower()

        occurrences = 0

        supporting_papers = []

        applications = Counter()

        for paper in papers:

            text = (

                (paper.title or "")

                + " "

                + (paper.abstract or "")

            ).lower()

            if application in text:

                occurrences += 1

                supporting_papers.append(

                    paper.title

                )

            applications[application] += (

                application in text

            )

        total = max(

            len(papers),

            1,

        )

        rarity = 1 - (

            occurrences / total

        )

        score = round(

            rarity * 100,

            2,

        )

        return {

            "score": score,

            "occurrences": occurrences,

            "supporting_papers": supporting_papers[:5],

            "reasoning":

                "Application novelty estimated using application frequency.",

        }
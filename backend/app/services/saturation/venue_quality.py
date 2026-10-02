from __future__ import annotations

from app.models.schemas import Paper


class VenueQuality:
    """
    Estimates research saturation based on the
    quality of publication venues.
    """

    VENUE_SCORES = {

        # Medical
        "nature": 100,
        "science": 100,
        "nature medicine": 98,
        "nature digital medicine": 96,
        "thelancet": 100,

        # AI / ML
        "neurips": 95,
        "icml": 94,
        "iclr": 94,
        "aaai": 90,
        "ijcai": 90,

        # Computer Vision
        "cvpr": 95,
        "iccv": 94,
        "eccv": 93,

        # Medical Imaging
        "miccai": 95,
        "medical image analysis": 94,
        "ieee transactions on medical imaging": 95,

        # NLP
        "acl": 94,
        "emnlp": 92,
        "naacl": 91,

        # IEEE / ACM
        "ieee": 80,
        "acm": 80,

        # Default
        "arxiv": 50,

    }

    DEFAULT_SCORE = 60

    # -------------------------------------------------------

    def compute(
        self,
        papers: list[Paper],
    ) -> dict:

        if not papers:

            return {

                "score": 0,

                "average_venue_score": 0,

                "top_venues": [],

                "reasoning": "No publication venues available."

            }

        venue_scores = []

        venue_frequency = {}

        for paper in papers:

            venue = (paper.venue or "").lower()

            score = self.DEFAULT_SCORE

            for name, value in self.VENUE_SCORES.items():

                if name in venue:

                    score = value

                    break

            venue_scores.append(score)

            if venue:

                venue_frequency[venue] = (

                    venue_frequency.get(venue, 0)

                    + 1

                )

        average_score = (

            sum(venue_scores)

            / len(venue_scores)

        )

        top_venues = sorted(

            venue_frequency.items(),

            key=lambda x: x[1],

            reverse=True,

        )[:10]

        return {

            "score": round(

                average_score,

                2,

            ),

            "average_venue_score": round(

                average_score,

                2,

            ),

            "top_venues": top_venues,

            "reasoning":

                "Venue quality estimated using conference and journal rankings."

        }
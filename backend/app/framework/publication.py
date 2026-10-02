from app.models.schemas import ResearchUnderstanding


class PublicationEngine:
    """
    Suggests appropriate publication venues based on
    the research domain, methodology, and RISF score.
    """

    def recommend(
        self,
        understanding: ResearchUnderstanding,
        risf_score: float,
    ) -> list[dict]:

        venues = []

        domain = understanding.domain.lower()

        # -----------------------------
        # Computer Vision
        # -----------------------------

        if "vision" in domain or "image" in domain:

            venues.extend([

                {
                    "venue": "CVPR",
                    "tier": "A*",
                    "min_score": 85
                },

                {
                    "venue": "ICCV",
                    "tier": "A*",
                    "min_score": 85
                },

                {
                    "venue": "ECCV",
                    "tier": "A*",
                    "min_score": 80
                }

            ])

        # -----------------------------
        # NLP
        # -----------------------------

        elif "nlp" in domain:

            venues.extend([

                {
                    "venue": "ACL",
                    "tier": "A*",
                    "min_score": 85
                },

                {
                    "venue": "EMNLP",
                    "tier": "A",
                    "min_score": 80
                }

            ])

        # -----------------------------
        # Healthcare AI
        # -----------------------------

        elif "medical" in domain or "health" in domain:

            venues.extend([

                {
                    "venue": "MICCAI",
                    "tier": "A*",
                    "min_score": 85
                },

                {
                    "venue": "Nature Digital Medicine",
                    "tier": "A*",
                    "min_score": 90
                }

            ])

        recommendations = [

            venue

            for venue in venues

            if risf_score >= venue["min_score"]

        ]

        return recommendations
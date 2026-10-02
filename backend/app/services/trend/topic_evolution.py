from __future__ import annotations

from collections import defaultdict

from app.models.schemas import Paper


class TopicEvolution:
    """
    Groups papers into research topics and
    analyzes how those topics evolve over time.
    """

    TOPIC_KEYWORDS = {

        "Computer Vision": [

            "vision",
            "image",
            "cnn",
            "transformer",
            "vit",
            "segmentation",
            "object detection",

        ],

        "Natural Language Processing": [

            "bert",
            "llm",
            "language",
            "gpt",
            "nlp",
            "retrieval",
            "rag",

        ],

        "Healthcare AI": [

            "mri",
            "ct",
            "xray",
            "alzheimer",
            "parkinson",
            "diagnosis",
            "medical",

        ],

        "Reinforcement Learning": [

            "reinforcement",
            "policy",
            "agent",
            "reward",

        ],

        "Graph Learning": [

            "graph",
            "gnn",
            "knowledge graph",

        ],

    }

    # ------------------------------------------------------

    def compute(

        self,

        papers: list[Paper],

    ) -> dict:

        topic_timeline = defaultdict(

            lambda: defaultdict(int)

        )

        for paper in papers:

            if paper.year is None:

                continue

            text = (

                (paper.title or "")

                + " "

                + (paper.abstract or "")

            ).lower()

            for topic, keywords in self.TOPIC_KEYWORDS.items():

                if any(

                    keyword in text

                    for keyword in keywords

                ):

                    topic_timeline[topic][paper.year] += 1

        ###################################################

        evolution = {}

        for topic, timeline in topic_timeline.items():

            years = sorted(

                timeline.keys()

            )

            if not years:

                continue

            first = timeline[years[0]]

            last = timeline[years[-1]]

            growth = last - first

            if growth > 5:

                trend = "Growing"

            elif growth < -5:

                trend = "Declining"

            else:

                trend = "Stable"

            evolution[topic] = {

                "timeline": dict(

                    sorted(

                        timeline.items()

                    )

                ),

                "growth": growth,

                "trend": trend,

            }

        ###################################################

        ranked = sorted(

            evolution.items(),

            key=lambda x: x[1]["growth"],

            reverse=True,

        )

        return {

            "topics": evolution,

            "top_topics": ranked,

            "reasoning":

                "Topic evolution estimated using domain-specific keyword groups."

        }
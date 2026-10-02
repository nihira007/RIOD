from __future__ import annotations

import re

from app.models.schemas import Paper


class MethodologyExtractor:
    """
    Extracts research methodologies,
    models and algorithms from papers.
    """

    KNOWN_METHODS = [

        "cnn",
        "resnet",
        "alexnet",
        "vision transformer",
        "vit",
        "swin transformer",
        "bert",
        "gpt",
        "large language model",
        "llm",
        "rag",
        "retrieval augmented generation",
        "graph neural network",
        "gnn",
        "transformer",
        "lstm",
        "gru",
        "autoencoder",
        "gan",
        "diffusion",
        "reinforcement learning",
        "federated learning",
        "transfer learning",
        "self supervised learning",
        "contrastive learning",
        "xgboost",
        "lightgbm",
        "catboost",
        "random forest",

    ]

    def compute(
        self,
        papers: list[Paper],
    ) -> dict:

        methods = []

        for paper in papers:

            text = (

                (paper.title or "")

                + " "

                + (paper.abstract or "")

            ).lower()

            found = set()

            ##################################################

            for method in self.KNOWN_METHODS:

                if method in text:

                    found.add(method)

            ##################################################

            methods.append(

                {

                    "paper": paper.title,

                    "methods": sorted(found),

                    "year": paper.year,

                    "citations": paper.citations,

                }

            )

        ##################################################

        frequency = {}

        for item in methods:

            for method in item["methods"]:

                frequency[method] = (

                    frequency.get(method, 0)

                    + 1

                )

        frequency = dict(

            sorted(

                frequency.items(),

                key=lambda x: x[1],

                reverse=True,

            )

        )

        ##################################################

        return {

            "methods": methods,

            "method_frequency": frequency,

            "reasoning":

                "Research methodologies extracted from retrieved literature."

        }
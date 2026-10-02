from __future__ import annotations

import itertools
import re

from app.models.schemas import Paper


class ContradictionDetector:
    """
    Detects potential contradictions between
    research papers using simple claim analysis.
    """

    POSITIVE_PATTERNS = [

        r"outperform",
        r"improve",
        r"better",
        r"higher",
        r"increase",
        r"effective",
        r"efficient",
        r"significant improvement",
        r"state[- ]of[- ]the[- ]art",

    ]

    NEGATIVE_PATTERNS = [

        r"no improvement",
        r"does not improve",
        r"fails",
        r"lower",
        r"decrease",
        r"ineffective",
        r"limited",
        r"poor",
        r"not significant",

    ]

    # -----------------------------------------------------

    def compute(
        self,
        papers: list[Paper],
    ) -> dict:

        contradictions = []

        ##################################################

        paper_claims = []

        for paper in papers:

            text = (

                (paper.title or "")

                + " "

                + (paper.abstract or "")

            ).lower()

            positive = any(

                re.search(

                    pattern,

                    text,

                )

                for pattern in self.POSITIVE_PATTERNS

            )

            negative = any(

                re.search(

                    pattern,

                    text,

                )

                for pattern in self.NEGATIVE_PATTERNS

            )

            paper_claims.append(

                {

                    "paper": paper.title,

                    "positive": positive,

                    "negative": negative,

                    "year": paper.year,

                    "citations": paper.citations,

                }

            )

        ##################################################

        for first, second in itertools.combinations(

            paper_claims,

            2,

        ):

            if (

                first["positive"]

                and

                second["negative"]

            ) or (

                first["negative"]

                and

                second["positive"]

            ):

                contradictions.append(

                    {

                        "paper_1": first["paper"],

                        "paper_2": second["paper"],

                        "type": "Performance",

                        "confidence": 0.70,

                    }

                )

        ##################################################

        return {

            "contradictions": contradictions,

            "count": len(

                contradictions

            ),

            "reasoning":

                "Potential contradictions detected using research claims."

        }
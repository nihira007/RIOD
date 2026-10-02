from __future__ import annotations

import re

from app.models.schemas import Paper


class ClaimExtractor:
    """
    Extracts important research claims from
    paper abstracts.

    The extracted claims are later used for
    contradiction detection, gap discovery,
    and opportunity ranking.
    """

    CLAIM_PATTERNS = [

        r"we propose (.+?)[.]",

        r"we present (.+?)[.]",

        r"this paper proposes (.+?)[.]",

        r"this work proposes (.+?)[.]",

        r"our approach (.+?)[.]",

        r"our method (.+?)[.]",

        r"results show (.+?)[.]",

        r"experiments demonstrate (.+?)[.]",

        r"we demonstrate (.+?)[.]",

        r"we show (.+?)[.]",

        r"our model (.+?)[.]",

    ]

    # ----------------------------------------------------

    def compute(

        self,

        papers: list[Paper],

    ) -> dict:

        claims = []

        for paper in papers:

            abstract = (paper.abstract or "")

            extracted = []

            for pattern in self.CLAIM_PATTERNS:

                matches = re.findall(

                    pattern,

                    abstract,

                    flags=re.IGNORECASE,

                )

                extracted.extend(matches)

            claims.append(

                {

                    "paper": paper.title,

                    "claims": extracted,

                    "year": paper.year,

                    "citations": paper.citations,

                }

            )

        return {

            "claims": claims,

            "total_claims":

                sum(

                    len(

                        c["claims"]

                    )

                    for c in claims

                ),

            "reasoning":

                "Research claims extracted from abstracts."

        }
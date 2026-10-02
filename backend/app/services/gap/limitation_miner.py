from __future__ import annotations

import re

from app.models.schemas import Paper


class LimitationMiner:
    """
    Extracts research limitations from
    paper abstracts.
    """

    LIMITATION_PATTERNS = [

        r"however(.+?)[.]",
        r"although(.+?)[.]",
        r"one limitation(.+?)[.]",
        r"limitations include(.+?)[.]",
        r"limited by(.+?)[.]",
        r"future work(.+?)[.]",
        r"remains challenging(.+?)[.]",
        r"still suffers from(.+?)[.]",
        r"fails to(.+?)[.]",
        r"unable to(.+?)[.]",
        r"does not(.+?)[.]",
        r"cannot(.+?)[.]",
        r"challenge(.+?)[.]",
        r"problem(.+?)[.]",

    ]

    def compute(
        self,
        papers: list[Paper],
    ) -> dict:

        limitations = []

        ##################################################

        for paper in papers:

            abstract = paper.abstract or ""

            extracted = []

            for pattern in self.LIMITATION_PATTERNS:

                matches = re.findall(

                    pattern,

                    abstract,

                    flags=re.IGNORECASE,

                )

                for match in matches:

                    limitation = match.strip()

                    if limitation:

                        extracted.append(limitation)

            limitations.append(

                {

                    "paper": paper.title,

                    "limitations": extracted,

                    "year": paper.year,

                    "citations": paper.citations,

                }

            )

        ##################################################

        frequency = {}

        for paper in limitations:

            for limitation in paper["limitations"]:

                frequency[limitation] = (

                    frequency.get(

                        limitation,

                        0,

                    )

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

            "limitations": limitations,

            "limitation_frequency": frequency,

            "reasoning":

                "Research limitations extracted from retrieved literature."

        }
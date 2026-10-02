from __future__ import annotations

import re

from app.models.schemas import Paper


class FutureWorkMiner:
    """
    Extracts future research directions
    from retrieved papers.
    """

    FUTURE_PATTERNS = [

        r"future work(.+?)[.]",

        r"in future(.+?)[.]",

        r"future studies(.+?)[.]",

        r"future research(.+?)[.]",

        r"we plan to(.+?)[.]",

        r"we intend to(.+?)[.]",

        r"can be extended(.+?)[.]",

        r"could be extended(.+?)[.]",

        r"may be extended(.+?)[.]",

        r"an interesting direction(.+?)[.]",

        r"remains future work(.+?)[.]",

        r"further investigation(.+?)[.]",

        r"further research(.+?)[.]",

        r"future improvements(.+?)[.]",

    ]

    def compute(
        self,
        papers: list[Paper],
    ) -> dict:

        future_work = []

        ##################################################

        for paper in papers:

            abstract = paper.abstract or ""

            extracted = []

            for pattern in self.FUTURE_PATTERNS:

                matches = re.findall(

                    pattern,

                    abstract,

                    flags=re.IGNORECASE,

                )

                for match in matches:

                    statement = match.strip()

                    if statement:

                        extracted.append(statement)

            future_work.append(

                {

                    "paper": paper.title,

                    "future_work": extracted,

                    "year": paper.year,

                    "citations": paper.citations,

                }

            )

        ##################################################

        frequency = {}

        for paper in future_work:

            for item in paper["future_work"]:

                frequency[item] = (

                    frequency.get(

                        item,

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

            "future_work": future_work,

            "future_work_frequency": frequency,

            "reasoning":

                "Future research directions extracted from retrieved literature."

        }
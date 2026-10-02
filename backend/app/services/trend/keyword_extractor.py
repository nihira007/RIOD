from __future__ import annotations

import re
from collections import Counter

from app.models.schemas import Paper


class KeywordExtractor:
    """
    Extracts and ranks research keywords from
    titles and abstracts.
    """

    STOPWORDS = {

        "the",
        "and",
        "using",
        "based",
        "approach",
        "method",
        "methods",
        "system",
        "study",
        "paper",
        "analysis",
        "research",
        "results",
        "proposed",
        "new",
        "towards",
        "via",
        "with",
        "for",
        "from",
        "into",
        "their",
        "this",
        "that",
        "our",
        "its",
        "been",
        "were",
        "are",
        "can",
        "may",

    }

    MIN_LENGTH = 3

    def compute(

        self,

        papers: list[Paper],

    ) -> dict:

        counter = Counter()

        keyword_sources = {}

        for paper in papers:

            text = (

                (paper.title or "")

                + " "

                + (paper.abstract or "")

            ).lower()

            words = re.findall(

                r"[a-zA-Z][a-zA-Z0-9\-]+",

                text,

            )

            for word in words:

                if len(word) < self.MIN_LENGTH:

                    continue

                if word in self.STOPWORDS:

                    continue

                counter[word] += 1

                keyword_sources.setdefault(

                    word,

                    set(),

                ).add(

                    paper.title

                )

        ranked = counter.most_common(50)

        keywords = [

            {

                "keyword": word,

                "count": count,

                "papers": len(

                    keyword_sources[word]

                ),

            }

            for word, count in ranked

        ]

        return {

            "keywords": keywords,

            "total_keywords": len(counter),

            "reasoning":

                "Keywords extracted from titles and abstracts."

        }
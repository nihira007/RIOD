from __future__ import annotations

from collections import Counter

from app.models.schemas import Paper


class CompetitionIndex:
    """
    Estimates how competitive a research field is.

    The score is based on:
    - Unique authors
    - Author diversity
    - Collaboration size
    - Publication concentration
    """

    def compute(
        self,
        papers: list[Paper],
    ) -> dict:

        if not papers:

            return {

                "score": 0,

                "unique_authors": 0,

                "average_authors": 0,

                "collaboration_score": 0,

                "reasoning": "No papers available."

            }

        ##################################################
        # Unique authors
        ##################################################

        author_counter = Counter()

        total_authors = 0

        for paper in papers:

            authors = paper.authors or []

            total_authors += len(authors)

            for author in authors:

                author_counter[author.strip()] += 1

        unique_authors = len(author_counter)

        ##################################################
        # Average authors per paper
        ##################################################

        average_authors = (

            total_authors

            / max(len(papers), 1)

        )

        ##################################################
        # Repeat author ratio
        ##################################################

        repeated_authors = sum(

            count > 1

            for count in author_counter.values()

        )

        repeat_ratio = (

            repeated_authors

            / max(unique_authors, 1)

        )

        ##################################################
        # Collaboration score
        ##################################################

        collaboration_score = min(

            average_authors / 10,

            1,

        )

        ##################################################
        # Competition score
        ##################################################

        competition_score = (

            min(

                unique_authors / 500,

                1,

            )

            * 50

            +

            collaboration_score * 30

            +

            repeat_ratio * 20

        ) * 100

        competition_score = max(

            0,

            min(

                competition_score,

                100,

            ),

        )

        ##################################################

        return {

            "score": round(

                competition_score,

                2,

            ),

            "unique_authors": unique_authors,

            "average_authors": round(

                average_authors,

                2,

            ),

            "repeat_author_ratio": round(

                repeat_ratio,

                2,

            ),

            "collaboration_score": round(

                collaboration_score,

                2,

            ),

            "reasoning":

                "Competition estimated using author diversity and collaboration."

        }
from collections import Counter

from app.models.schemas import Paper, ResearchUnderstanding


class MethodologyNovelty:

    """
    Estimates how unique the proposed methodology is
    compared with retrieved literature.
    """

    def compute(

        self,

        understanding: ResearchUnderstanding,

        papers: list[Paper],

    ) -> dict:

        proposed = understanding.methodology.lower()

        occurrences = 0

        similar_methods = []

        method_counter = Counter()

        for paper in papers:

            text = (

                (paper.title or "")

                + " "

                + (paper.abstract or "")

            ).lower()

            if proposed in text:

                occurrences += 1

                similar_methods.append(

                    paper.title

                )

            keywords = proposed.split()

            overlap = sum(

                1

                for keyword in keywords

                if keyword in text

            )

            method_counter[overlap] += 1

        total = max(

            len(papers),

            1,

        )

        rarity = 1 - (

            occurrences / total

        )

        score = round(

            rarity * 100,

            2,

        )

        return {

            "score": score,

            "occurrences": occurrences,

            "supporting_papers": similar_methods[:5],

            "distribution": dict(method_counter),

        }
from collections import Counter

from app.models.schemas import Paper, ResearchUnderstanding


class DatasetNovelty:
    """
    Estimates dataset novelty by comparing
    proposed datasets against datasets
    mentioned in retrieved literature.
    """

    COMMON_DATASETS = [

        "adni",
        "oasis",
        "uk biobank",
        "imagenet",
        "cifar",
        "mnist",
        "coco",
        "mimic",
        "physionet",

    ]

    def compute(

        self,

        understanding: ResearchUnderstanding,

        papers: list[Paper],

    ) -> dict:

        corpus = []

        for paper in papers:

            text = (

                (paper.title or "")

                + " "

                + (paper.abstract or "")

            ).lower()

            corpus.append(text)

        dataset_counter = Counter()

        for dataset in self.COMMON_DATASETS:

            occurrences = sum(

                dataset in text

                for text in corpus

            )

            dataset_counter[dataset] = occurrences

        proposed_text = (

            understanding.expected_contribution

            + " "

            + understanding.methodology

        ).lower()

        proposed = [

            dataset

            for dataset in self.COMMON_DATASETS

            if dataset in proposed_text

        ]

        if not proposed:

            score = 85.0

            reasoning = (

                "No common benchmark datasets were explicitly mentioned."
            )

        else:

            frequencies = [

                dataset_counter[d]

                for d in proposed

            ]

            average_frequency = (

                sum(frequencies)

                / len(frequencies)

            )

            score = max(

                0,

                100 - average_frequency * 5,

            )

            reasoning = (

                "Dataset novelty estimated from dataset usage frequency."

            )

        return {

            "score": round(score, 2),

            "datasets": proposed,

            "dataset_usage": dict(dataset_counter),

            "reasoning": reasoning,

        }
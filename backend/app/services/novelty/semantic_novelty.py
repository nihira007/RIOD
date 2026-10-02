from sklearn.metrics.pairwise import cosine_similarity
import numpy as np


class SemanticNovelty:

    """
    Computes semantic novelty using embeddings.
    """

    def compute(
        self,
        idea_embedding,
        paper_embeddings,
    ):

        # No literature available
        if paper_embeddings is None or len(paper_embeddings) == 0:

            return {
                "score": 0.0,
                "highest_similarity": 0.0,
                "average_similarity": 0.0,
            }

        similarities = cosine_similarity(
            [idea_embedding],
            paper_embeddings,
        )[0]

        highest_similarity = float(
            np.max(similarities)
        )

        average_similarity = float(
            np.mean(similarities)
        )

        novelty = (
            1 - highest_similarity
        ) * 100

        return {
            "score": round(
                novelty,
                2,
            ),
            "highest_similarity":
                highest_similarity,
            "average_similarity":
                average_similarity,
        }
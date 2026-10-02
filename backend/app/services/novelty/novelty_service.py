from __future__ import annotations

from app.framework.evidence import EvidenceCollector
from app.framework.confidence import (
    ConfidenceEngine,
    ConfidenceFactors,
)
from app.framework.scoring import RISFMetric

from app.models.schemas import (
    Paper,
    ResearchUnderstanding,
)

from app.providers.embeddings.embedding_provider import (
    EmbeddingProvider,
)

from app.services.novelty.semantic_novelty import (
    SemanticNovelty,
)

from app.services.novelty.methodology_novelty import (
    MethodologyNovelty,
)

from app.services.novelty.dataset_novelty import (
    DatasetNovelty,
)

from app.services.novelty.application_novelty import (
    ApplicationNovelty,
)

from app.services.novelty.temporal_novelty import (
    TemporalNovelty,
)


class NoveltyService:

    WEIGHTS = {
        "semantic": 0.35,
        "methodology": 0.25,
        "dataset": 0.15,
        "application": 0.15,
        "temporal": 0.10,
    }

    def __init__(
        self,
        embedding: EmbeddingProvider,
    ):
        self.embedding = embedding

        self.semantic = SemanticNovelty()
        self.methodology = MethodologyNovelty()
        self.dataset = DatasetNovelty()
        self.application = ApplicationNovelty()
        self.temporal = TemporalNovelty()

        self.confidence_engine = ConfidenceEngine()

    # --------------------------------------------------------
    # Novelty Analysis
    # --------------------------------------------------------

    async def analyze(
        self,
        understanding: ResearchUnderstanding,
        papers: list[Paper],
    ) -> RISFMetric:

        collector = EvidenceCollector()

        # ====================================================
        # 1. Semantic Novelty
        # ====================================================

        semantic = {
            "score": 0.0,
            "highest_similarity": 0.0,
            "average_similarity": 0.0,
        }

        if self.embedding.available and papers:

            paper_embeddings = self.embedding.encode_batch(
                [
                    p.title + " " + (p.abstract or "")
                    for p in papers
                ]
            )

            idea_embedding = self.embedding.encode(
                understanding.research_problem
            )

            semantic = self.semantic.compute(
                idea_embedding,
                paper_embeddings,
            )

            semantic_score = semantic["score"]

            collector.add(
                title="Semantic Novelty",
                description=(
                    f"Highest similarity = "
                    f"{semantic['highest_similarity']:.2f}"
                ),
                source="Embeddings",
                confidence=0.95,
            )

        else:

            semantic_score = 0.0

            collector.add(
                title="Semantic Novelty",
                description=(
                    "Semantic novelty unavailable because "
                    "no literature was retrieved or embeddings "
                    "are unavailable."
                ),
                source="Embeddings",
                confidence=0.0,
            )

        # ====================================================
        # 2. Methodology Novelty
        # ====================================================

        methodology = self.methodology.compute(
            understanding,
            papers,
        )

        collector.add(
            title="Methodology Novelty",
            description=(
                f"Occurrences: "
                f"{methodology['occurrences']}"
            ),
            source="Method Analysis",
            confidence=0.90,
        )

        # ====================================================
        # 3. Dataset Novelty
        # ====================================================

        dataset = self.dataset.compute(
            understanding,
            papers,
        )

        collector.add(
            title="Dataset Novelty",
            description=dataset["reasoning"],
            source="Dataset Analysis",
            confidence=0.88,
        )

        # ====================================================
        # 4. Application Novelty
        # ====================================================

        application = self.application.compute(
            understanding,
            papers,
        )

        collector.add(
            title="Application Novelty",
            description=application["reasoning"],
            source="Application Analysis",
            confidence=0.90,
        )

        # ====================================================
        # 5. Temporal Novelty
        # ====================================================

        temporal = self.temporal.compute(
            papers,
        )

        collector.add(
            title="Temporal Novelty",
            description=temporal["reasoning"],
            source="Publication Timeline",
            confidence=0.85,
        )

        # ====================================================
        # 6. Final Novelty Score
        # ====================================================

        score = (
            semantic_score * self.WEIGHTS["semantic"]
            + methodology["score"] * self.WEIGHTS["methodology"]
            + dataset["score"] * self.WEIGHTS["dataset"]
            + application["score"] * self.WEIGHTS["application"]
            + temporal["score"] * self.WEIGHTS["temporal"]
        )

        # ====================================================
        # 7. Confidence
        # ====================================================

        confidence = self.confidence_engine.compute(
            ConfidenceFactors(
                data_quality=0.90,
                evidence_strength=0.90,
                literature_coverage=min(
                    len(papers) / 50,
                    1,
                ),
                consistency=0.88,
                recency=0.92,
            )
        )

        # ====================================================
        # 8. Final Evidence
        # ====================================================

        collector.deduplicate()

        # ====================================================
        # 9. RISF Metric
        # ====================================================

        return RISFMetric(
            name="Novelty",
            score=round(score, 2),
            confidence=confidence,
            reasoning=(
                "Novelty computed using the Multi-Dimensional "
                "Novelty Engine (MDNE)."
            ),
            evidence=collector.top(10),
            metadata={
                "semantic": semantic_score,
                "methodology": methodology,
                "dataset": dataset,
                "application": application,
                "temporal": temporal,
            },
        )
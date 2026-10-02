from __future__ import annotations

from dataclasses import dataclass, field
from statistics import mean

from app.framework.evidence import Evidence


# =====================================================
# RISF Metric
# =====================================================

@dataclass
class RISFMetric:
    """
    Standard output produced by every
    Research Intelligence module.
    """

    name: str

    score: float

    confidence: float

    reasoning: str

    evidence: list[Evidence] = field(default_factory=list)

    metadata: dict = field(default_factory=dict)


# =====================================================
# Scoring Engine
# =====================================================

class ScoringEngine:

    """
    Aggregates all RISF metrics into one
    unified Research Intelligence Score.
    """

    DEFAULT_WEIGHTS = {

        "Novelty": 0.25,

        "Saturation": 0.20,

        "Trend": 0.15,

        "Gap": 0.20,

        "Dataset": 0.10,

        "Publishability": 0.10,

    }

    def __init__(

        self,

        weights: dict | None = None,

    ):

        self.weights = weights or self.DEFAULT_WEIGHTS

    # ----------------------------------------------------

    def compute(

        self,

        metrics: list[RISFMetric],

    ) -> dict:

        weighted_score = 0

        weighted_confidence = 0

        total_weight = 0

        all_evidence = []

        for metric in metrics:

            weight = self.weights.get(

                metric.name,

                0,

            )

            weighted_score += metric.score * weight

            weighted_confidence += (

                metric.confidence * weight

            )

            total_weight += weight

            all_evidence.extend(

                metric.evidence

            )

        if total_weight == 0:

            return {

                "score": 0,

                "confidence": 0,

                "evidence": [],

                "metrics": metrics,

            }

        return {

            "score": round(

                weighted_score / total_weight,

                2,

            ),

            "confidence": round(

                weighted_confidence / total_weight,

                3,

            ),

            "evidence": sorted(

                all_evidence,

                key=lambda x: x.confidence,

                reverse=True,

            ),

            "metrics": metrics,

        }

    # ----------------------------------------------------

    def normalize(

        self,

        score: float,

        min_score: float,

        max_score: float,

    ) -> float:

        if max_score == min_score:

            return 0

        value = (

            score - min_score

        ) / (

            max_score - min_score

        )

        return max(

            0,

            min(

                value * 100,

                100,

            ),

        )

    # ----------------------------------------------------

    def average_score(

        self,

        metrics: list[RISFMetric],

    ) -> float:

        return round(

            mean(

                metric.score

                for metric in metrics

            ),

            2,

        )
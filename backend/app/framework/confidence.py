from __future__ import annotations

from dataclasses import dataclass


@dataclass
class ConfidenceFactors:
    """
    Inputs used to estimate confidence for a RISF metric.
    Every value should be normalized between 0 and 1.
    """

    data_quality: float = 1.0
    evidence_strength: float = 1.0
    literature_coverage: float = 1.0
    consistency: float = 1.0
    recency: float = 1.0


class ConfidenceEngine:

    """
    Computes confidence scores for RISF metrics.

    The result is always between 0 and 1.
    """

    WEIGHTS = {

        "data_quality": 0.20,

        "evidence_strength": 0.30,

        "literature_coverage": 0.20,

        "consistency": 0.20,

        "recency": 0.10,

    }

    # ----------------------------------------------------

    def compute(

        self,

        factors: ConfidenceFactors,

    ) -> float:

        confidence = (

            factors.data_quality
            * self.WEIGHTS["data_quality"]

            +

            factors.evidence_strength
            * self.WEIGHTS["evidence_strength"]

            +

            factors.literature_coverage
            * self.WEIGHTS["literature_coverage"]

            +

            factors.consistency
            * self.WEIGHTS["consistency"]

            +

            factors.recency
            * self.WEIGHTS["recency"]

        )

        confidence = max(
            0.0,
            min(
                confidence,
                1.0,
            ),
        )

        return round(
            confidence,
            3,
        )
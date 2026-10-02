from __future__ import annotations

from app.framework.scoring import RISFMetric


def _humanize(key: str) -> str:
    return key.replace("_", " ").strip().title()


def extract_contributing_factors(metric: RISFMetric) -> list[dict]:
    """
    Converts the metric metadata into normalized explainable factors.

    A factor is recognized when its metadata value is:
      - a dict containing a numeric "score", or
      - a bare numeric value.
    """

    factors = []

    for key, value in (metric.metadata or {}).items():

        score = None
        detail = None

        if isinstance(value, dict):

            score = value.get("score")

            detail = (
                value.get("reasoning")
                or value.get("explanation")
                or value.get("remarks")
            )

        elif isinstance(value, (int, float)) and not isinstance(value, bool):

            score = value

        if isinstance(score, (int, float)) and not isinstance(score, bool):

            factors.append({
                "factor": _humanize(key),
                "score": round(float(score), 2),
                "detail": detail,
            })

    factors.sort(
        key=lambda f: f["score"],
        reverse=True
    )

    return factors


class RISF:
    """
    Research Intelligence Scoring Framework.

    Original RIS formula:

        RIS = (NS + GS + TS + (100 - SS)) / 4

    where:

        NS = Novelty Score
        GS = Research Gap Score
        TS = Trend Score
        SS = Saturation Score

    Saturation is inverted because a lower saturation score represents
    greater research opportunity.

    All four dimensions contribute equally.
    """

    # Equal weights corresponding to the original formula.
    BASE_WEIGHTS = {

        "Novelty": 0.25,

        "Trend": 0.25,

        "Research Gap": 0.25,

        "Saturation": 0.25,

    }

    # Saturation is the only inverse metric.
    POLARITY = {

        "Novelty": 1,

        "Trend": 1,

        "Research Gap": 1,

        "Saturation": -1,

    }

    PUBLICATION_READY_THRESHOLD = 85

    def __init__(
        self,
        weights: dict | None = None,
        gamma: float | None = None,
    ):

        # Keep the arguments for backward compatibility.
        # The original RIS formula uses equal weights.
        self.weights = weights or self.BASE_WEIGHTS

        self.gamma = 0.0 if gamma is None else gamma

    # -----------------------------------------------------

    def _opportunity_value(self, metric: RISFMetric) -> float:

        polarity = self.POLARITY.get(
            metric.name,
            1
        )

        if polarity == -1:

            return 100 - metric.score

        return metric.score

    # -----------------------------------------------------

    def _effective_weights(
        self,
        metrics: list[RISFMetric],
    ) -> dict[str, float]:

        """
        Every available metric gets equal weight.

        With all four metrics:

            Novelty       = 0.25
            Trend         = 0.25
            Research Gap  = 0.25
            Saturation    = 0.25

        If one engine fails and is removed before RISF, the remaining
        metrics are normalized equally so that the system remains
        operational.
        """

        if not metrics:

            return {}

        weight = 1.0 / len(metrics)

        return {
            metric.name: weight
            for metric in metrics
        }

    # -----------------------------------------------------

    def evaluate(
        self,
        metrics: list[RISFMetric],
    ) -> dict:

        if not metrics:

            return {
                "overall_score": 0,

                "confidence": 0,

                "verdict": "Poor",

                "low_confidence": True,

                "details": {},

                "weight_breakdown": {},

                "contributions": {},

                "explainability": {},

                "top_evidence": [],

                "gamma": self.gamma,

                "reasoning": (
                    "No research metrics were available "
                    "to calculate RIS."
                ),
            }

        # -------------------------------------------------
        # Equal weighting
        # -------------------------------------------------

        effective_weights = self._effective_weights(
            metrics
        )

        overall = 0.0

        weighted_confidence = 0.0

        evidence = []

        details = {}

        contributions = {}

        explainability = {}

        # -------------------------------------------------
        # Calculate RIS
        # -------------------------------------------------

        for metric in metrics:

            w_eff = effective_weights.get(
                metric.name,
                0.0
            )

            # Convert saturation into opportunity.
            opportunity = self._opportunity_value(
                metric
            )

            # Contribution to RIS.
            contribution = opportunity * w_eff

            overall += contribution

            weighted_confidence += (
                metric.confidence * w_eff
            )

            evidence.extend(
                metric.evidence
            )

            details[metric.name] = {

                "score": metric.score,

                "confidence": metric.confidence,

            }

            contributions[metric.name] = round(
                contribution,
                2
            )

            explainability[metric.name] = {

                "base_weight": 0.25,

                "effective_weight": round(
                    w_eff,
                    4
                ),

                "polarity": self.POLARITY.get(
                    metric.name,
                    1
                ),

                "opportunity_value": round(
                    opportunity,
                    2
                ),

                "reasoning": metric.reasoning,

                "contributing_factors":
                    extract_contributing_factors(
                        metric
                    ),

            }

        # -------------------------------------------------
        # Final RIS
        # -------------------------------------------------

        overall = round(
            min(
                max(overall, 0),
                100
            ),
            2
        )

        average_confidence = round(
            weighted_confidence,
            3
        )

        # -------------------------------------------------
        # Verdict
        # -------------------------------------------------

        if overall >= 85:

            verdict = "Excellent"

        elif overall >= 70:

            verdict = "Strong"

        elif overall >= 55:

            verdict = "Moderate"

        elif overall >= 40:

            verdict = "Weak"

        else:

            verdict = "Poor"

        low_confidence = (
            average_confidence < 0.5
        )

        # -------------------------------------------------
        # Evidence
        # -------------------------------------------------

        evidence.sort(
            key=lambda x: x.confidence,
            reverse=True
        )

        # -------------------------------------------------
        # Weight explanation
        # -------------------------------------------------

        weight_summary = ", ".join(

            f"{name} {round(w * 100)}%"

            for name, w in sorted(
                effective_weights.items(),
                key=lambda x: -x[1]
            )

        )

        # -------------------------------------------------
        # Reasoning
        # -------------------------------------------------

        reasoning = (

            "RIS calculated using the original equal-weight "
            "Research Intelligence Score formula: "
            "(Novelty + Research Gap + Trend + "
            "(100 - Saturation)) / 4. "

            f"Effective weights: {weight_summary}. "

            "Saturation is inverted before aggregation because "
            "higher saturation represents lower research opportunity."

        )

        if low_confidence:

            reasoning += (

                " Overall confidence is low, most likely due "
                "to incomplete or sparse literature evidence. "
                "Interpret the score cautiously."

            )

        # -------------------------------------------------
        # Final result
        # -------------------------------------------------

        return {

            "overall_score": overall,

            "confidence": average_confidence,

            "verdict": verdict,

            "low_confidence": low_confidence,

            "details": details,

            "weight_breakdown": effective_weights,

            "contributions": contributions,

            "explainability": explainability,

            "top_evidence": evidence[:20],

            "gamma": self.gamma,

            "reasoning": reasoning,

        }
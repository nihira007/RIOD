from __future__ import annotations

from dataclasses import dataclass

from app.framework.scoring import RISFMetric


@dataclass
class SimulationResult:

    scenario: str

    predicted_score: float

    improvement: float

    explanation: str


class ImprovementSimulator:
    """
    Projects the effect of acting on each recommendation.

    Each recommendation already carries `expected_impact`: the
    predicted increase to the overall ROII score, computed by the
    RecommendationEngine as

        expected_impact = effective_weight * score_gap * REALISM_FACTOR

    using the *same* effective weights ROII itself used. The simulator
    simply applies that delta on top of the current overall score, so
    diagnosis (ROII), prescription (recommendations) and projection
    (simulation) all share one consistent, explainable formula instead
    of three independently-tuned heuristics.
    """

    def simulate(self, metrics: list[RISFMetric], recommendations) -> dict:

        current = round(
            sum(m.score for m in metrics) / len(metrics), 2
        ) if metrics else 0.0

        simulations = []

        for recommendation in recommendations:

            delta = getattr(recommendation, "expected_impact", 0.0)

            if not delta or delta <= 0:
                continue

            predicted = min(current + delta, 100)

            simulations.append(
                SimulationResult(
                    scenario=recommendation.title,
                    predicted_score=round(predicted, 2),
                    improvement=round(delta, 2),
                    explanation=recommendation.why,
                )
            )

        simulations.sort(key=lambda x: x.improvement, reverse=True)

        return {
            "current_score": current,
            "best_possible_score": simulations[0].predicted_score if simulations else current,
            "simulations": simulations,
        }

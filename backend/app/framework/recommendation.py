from __future__ import annotations

from dataclasses import dataclass, field

from app.framework.scoring import RISFMetric
from app.framework.risf import RISF


@dataclass
class Recommendation:

    priority: str

    category: str

    title: str

    why: str

    suggested_actions: list[str]

    based_on: str

    effective_weight: float

    score_gap: float

    expected_impact: float

    # Kept for backward compatibility with any code/UI still reading
    # `description` directly (now mirrors `why`).
    description: str = field(default="")

    def __post_init__(self):
        if not self.description:
            self.description = self.why


# --------------------------------------------------------------------
# Category metadata: display copy + which metadata sub-factors (in
# priority order) should be consulted to find the weakest dimension.
# --------------------------------------------------------------------

_CATEGORY_INFO = {

    "Novelty": {
        "title": "Increase Research Novelty",
        "fallback_why": "Several closely related approaches already exist in the retrieved literature.",
        "sub_factors": ["dataset", "methodology", "application", "temporal"],
        "actions": {
            "dataset": "Introduce a new dataset or benchmark not yet used in this space",
            "methodology": "Explore an alternative algorithmic or architectural approach",
            "application": "Target a less-explored application domain",
            "temporal": "Differentiate clearly from the wave of very recent, closely related work",
            "semantic": "Reframe the core problem statement to reduce overlap with existing work",
        },
        "generic_actions": [
            "Combine methods from adjacent domains for a hybrid approach",
            "Explore multi-modal or cross-domain extensions",
        ],
    },

    "Trend": {
        "title": "Target Emerging Topics",
        "fallback_why": "Research interest in this direction appears flat or declining in recent publications.",
        "sub_factors": ["publication"],
        "actions": {
            "publication": "Reframe the idea around a currently accelerating sub-topic",
        },
        "generic_actions": [
            "Adopt terminology and methods from fast-growing adjacent keywords",
            "Publish incremental results early to establish presence as the area grows",
        ],
    },

    "Saturation": {
        "title": "Reduce Topic Saturation",
        "fallback_why": "The retrieved literature shows substantial existing work covering similar ground.",
        "sub_factors": ["competition_index", "publication_density", "venue_quality"],
        "actions": {
            "competition_index": "Propose a collaboration or integration angle competitors haven't covered",
            "publication_density": "Narrow the scope to a less-crowded sub-niche",
            "venue_quality": "Target a specialised venue or workshop rather than the most competitive tier",
        },
        "generic_actions": [
            "Differentiate via a novel dataset, domain, or evaluation protocol",
            "Position the contribution against the most-cited recent papers explicitly",
        ],
    },

    "Research Gap": {
        "title": "Investigate Open Problems",
        "fallback_why": "Few clear, well-evidenced research gaps were identified in the retrieved literature.",
        "sub_factors": ["limitations", "future_work", "contradictions"],
        "actions": {
            "limitations": "Directly address a repeated limitation reported across multiple papers",
            "future_work": "Pursue the specific future-work direction papers converge on",
            "contradictions": "Resolve a contradiction found between conflicting papers",
        },
        "generic_actions": [
            "Target the highest-ranked open problem identified in the literature",
            "Propose a novel collaboration or evaluation strategy for an under-served sub-area",
        ],
    },

}


def _weakest_sub_factor(metric: RISFMetric, sub_factors: list[str]) -> tuple[str | None, str | None]:
    """
    Returns (key, detail_text) for whichever listed sub-factor has the
    lowest "score" in the metric's metadata -- i.e. the dimension that
    most needs attention. Falls back to (None, None) if no scored
    sub-factor is present.
    """

    metadata = metric.metadata or {}

    best_key = None
    best_score = None
    best_detail = None

    for key in sub_factors:

        value = metadata.get(key)

        if not isinstance(value, dict):
            continue

        score = value.get("score")

        if not isinstance(score, (int, float)):
            continue

        if best_score is None or score < best_score:
            best_score = score
            best_key = key
            best_detail = (
                value.get("reasoning")
                or value.get("explanation")
                or value.get("remarks")
            )

    return best_key, best_detail


class RecommendationEngine:
    """
    Generates recommendations ranked by *actionable impact*:

        impact_i = w_i_eff * gap_i

    where `w_i_eff` is the exact effective weight ROII assigned to
    dimension i (so a recommendation's priority reflects both how far
    that dimension is from "good" AND how much it actually moves the
    final score for *this* idea, rather than a fixed per-category
    rule), and `gap_i` is the distance to a realistic target -- for
    Saturation this is measured as distance *above* an acceptable
    ceiling, since lower is better there.
    """

    TARGET = RISF.PUBLICATION_READY_THRESHOLD  # 85
    SATURATION_CEILING = 60

    # Fraction of the gap a recommendation is assumed to realistically
    # close if acted on -- an explicit, documented assumption rather
    # than a hidden per-category constant.
    REALISM_FACTOR = 0.5

    def generate(self, metrics: list[RISFMetric], risf_result: dict) -> list[Recommendation]:

        weights = risf_result.get("weight_breakdown", {})
        by_name = {m.name: m for m in metrics}

        candidates = []

        for name, info in _CATEGORY_INFO.items():

            metric = by_name.get(name)

            if metric is None:
                continue

            w_eff = weights.get(name, 0.0)

            if name == "Saturation":
                gap = max(0.0, metric.score - self.SATURATION_CEILING)
            else:
                gap = max(0.0, self.TARGET - metric.score)

            if gap <= 0:
                continue

            impact = w_eff * gap

            weakest_key, weakest_detail = _weakest_sub_factor(metric, info["sub_factors"])

            why = weakest_detail or info["fallback_why"]

            actions: list[str] = []

            if weakest_key and weakest_key in info["actions"]:
                actions.append(info["actions"][weakest_key])

            for a in info["actions"].values():
                if a not in actions:
                    actions.append(a)

            for a in info["generic_actions"]:
                if a not in actions:
                    actions.append(a)

            actions = actions[:3]

            candidates.append({
                "name": name,
                "title": info["title"],
                "why": why,
                "actions": actions,
                "effective_weight": w_eff,
                "gap": gap,
                "impact": impact,
            })

        candidates.sort(key=lambda c: c["impact"], reverse=True)

        recommendations: list[Recommendation] = []

        for rank, c in enumerate(candidates):

            if rank == 0:
                priority = "High"
            elif rank == 1:
                priority = "Medium"
            else:
                priority = "Low"

            expected_impact = round(c["effective_weight"] * c["gap"] * self.REALISM_FACTOR, 1)

            recommendations.append(
                Recommendation(
                    priority=priority,
                    category=c["name"],
                    title=c["title"],
                    why=c["why"],
                    suggested_actions=c["actions"],
                    based_on=f"{c['name']} Engine",
                    effective_weight=round(c["effective_weight"], 4),
                    score_gap=round(c["gap"], 2),
                    expected_impact=expected_impact,
                )
            )

        if risf_result.get("overall_score", 0) >= self.TARGET and not recommendations:
            recommendations.append(
                Recommendation(
                    priority="Low",
                    category="Publication",
                    title="Ready for Publication",
                    why="The research idea demonstrates strong overall potential across every engine.",
                    suggested_actions=[
                        "Prepare a full experimental evaluation section",
                        "Identify 2-3 target venues aligned with the domain",
                        "Draft a related-work section from the retrieved literature",
                    ],
                    based_on="ROII",
                    effective_weight=1.0,
                    score_gap=0.0,
                    expected_impact=0.0,
                )
            )

        return recommendations

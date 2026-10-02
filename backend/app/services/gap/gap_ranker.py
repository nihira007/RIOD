from __future__ import annotations

from dataclasses import dataclass


@dataclass
class GapScore:

    title: str

    score: float

    novelty: float

    impact: float

    feasibility: float

    evidence: float

    confidence: float

    explanation: str


class GapRanker:
    """
    Ranks research gaps according to their
    research opportunity.
    """

    WEIGHTS = {

        "novelty": 0.30,

        "impact": 0.25,

        "feasibility": 0.15,

        "evidence": 0.20,

        "confidence": 0.10,

    }

    # -------------------------------------------------------

    def compute(

        self,

        gaps: list[dict],

    ) -> dict:

        ranked = []

        for gap in gaps:

            novelty = gap.get(

                "novelty",

                0.5,

            )

            impact = gap.get(

                "impact",

                0.5,

            )

            feasibility = gap.get(

                "feasibility",

                0.5,

            )

            evidence = gap.get(

                "evidence",

                0.5,

            )

            confidence = gap.get(

                "confidence",

                0.5,

            )

            score = (

                novelty

                * self.WEIGHTS["novelty"]

                +

                impact

                * self.WEIGHTS["impact"]

                +

                feasibility

                * self.WEIGHTS["feasibility"]

                +

                evidence

                * self.WEIGHTS["evidence"]

                +

                confidence

                * self.WEIGHTS["confidence"]

            )

            ranked.append(

                GapScore(

                    title=gap["title"],

                    score=round(

                        score * 100,

                        2,

                    ),

                    novelty=novelty,

                    impact=impact,

                    feasibility=feasibility,

                    evidence=evidence,

                    confidence=confidence,

                    explanation=gap.get(

                        "description",

                        "",

                    ),

                )

            )

        ###################################################

        ranked.sort(

            key=lambda x: x.score,

            reverse=True,

        )

        ###################################################

        return {

            "top_gap":

                ranked[0]

                if ranked

                else None,

            "ranked_gaps":

                ranked,

            "reasoning":

                "Research gaps ranked using the Research Opportunity Score."

        }
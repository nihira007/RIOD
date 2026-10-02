from __future__ import annotations

import json

from app.core.logger import logger
from app.models.pipeline_result import ExecutiveSummary
from app.models.schemas import (
    ResearchIdea,
    ResearchUnderstanding,
    Paper,
)
from app.framework.scoring import RISFMetric
from app.framework.recommendation import Recommendation


class ExecutiveSummary:

    def __init__(self, llm):
        self.llm = llm

    async def analyze(
        self,
        understanding: ResearchUnderstanding,
        idea: ResearchIdea,
        papers: list[Paper],
        novelty: RISFMetric | None,
        saturation: RISFMetric | None,
        trend: RISFMetric | None,
        gap: RISFMetric | None,
        risf: dict,
        recommendations: list[Recommendation],
    ) -> ExecutiveSummary:

        prompt = f"""
You are an experienced IEEE research reviewer.

Generate an executive summary for the following research idea.

Research Idea
-------------
Title:
{idea.title}

Domain:
{understanding.domain}

Problem:
{understanding.research_problem}

Objective:
{understanding.research_objective}

Methodology:
{understanding.methodology}

Application:
{understanding.application_area}

Keywords:
{", ".join(understanding.keywords)}

----------------------------------------

Analysis Results

Novelty Score:
{novelty.score if novelty else "Unavailable"}

Novelty Explanation:
{novelty.reasoning if novelty else "Novelty analysis was unavailable."}

Saturation Score:
{saturation.score if saturation else "Unavailable"}

Saturation Explanation:
{saturation.reasoning if saturation else "Saturation analysis was unavailable."}

Trend Score:
{trend.score if trend else "Unavailable"}

Trend Explanation:
{trend.reasoning if trend else "Trend analysis was unavailable."}

Gap Score:
{gap.score if gap else "Unavailable"}

Gap Explanation:
{gap.reasoning if gap else "Research gap analysis was unavailable."}

Overall RISF Score:
{risf.get("overall_score")}

Top Recommendations:
{[r.title for r in recommendations]}

Retrieved Papers:
{len(papers)}

----------------------------------------

Return ONLY valid JSON.

{{
    "overall_score": number,
    "verdict": "Excellent | Promising | Moderate | Weak",
    "confidence": number,
    "summary": "...",

    "strengths": [
        "...",
        "...",
        "..."
    ],

    "weaknesses": [
        "...",
        "..."
    ],

    "recommendation": "One concise recommendation."
}}

Do not include markdown.
Do not include explanations outside JSON.
"""

        try:

            response = await self.llm.generate(prompt)

            data = json.loads(response)

            return ExecutiveSummary(**data)

        except Exception as e:

            logger.exception(
                "Executive Summary generation failed."
            )

            return ExecutiveSummary(

                overall_score=risf.get(
                    "overall_score",
                    0
                ),

                verdict="Unable to Evaluate",

                confidence=0,

                summary=(
                    "The executive summary could not "
                    "be generated."
                ),

                strengths=[],

                weaknesses=[],

                recommendation=(
                    "Review the research idea manually."
                ),

            )
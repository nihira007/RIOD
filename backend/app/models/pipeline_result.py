from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field

from app.framework.scoring import RISFMetric
from app.models.schemas import (
    Paper,
    ResearchUnderstanding,
)
from app.framework.recommendation import Recommendation
from app.framework.simulator import SimulationResult

class ResearchGap(BaseModel):
    title: str
    category: str

    explanation: str

    research_opportunity: str

    supporting_papers: list[str] = Field(default_factory=list)

    evidence_points: list[str] = Field(default_factory=list)

    confidence: float

    score: float

    novelty: float
    impact: float
    feasibility: float
    evidence: float

class ExecutiveSummary(BaseModel):

    overall_score: float

    verdict: str

    confidence: float

    summary: str

    strengths: list[str] = Field(default_factory=list)

    weaknesses: list[str] = Field(default_factory=list)

    key_contributions: list[str] = Field(default_factory=list)

    publication_potential: str

    publication_probability: float

    recommendation: str

    next_steps: list[str] = Field(default_factory=list)

class ResearchPipelineResult(BaseModel):
    """
    Final output produced by the complete
    Research Intelligence Pipeline.
    """

    understanding: ResearchUnderstanding = Field(
        ...,
        description="Structured understanding of the research idea.",
    )

    papers: list[Paper] = Field(
        default_factory=list,
        description="Retrieved literature.",
    )

    novelty: RISFMetric = Field(
        ...,
        description="Novelty analysis.",
    )

    saturation: RISFMetric = Field(
        ...,
        description="Research saturation analysis.",
    )

    trend: RISFMetric = Field(
        ...,
        description="Research trend analysis.",
    )

    gap: RISFMetric = Field(
        ...,
        description="Research gap analysis.",
    )

    executive_summary: ExecutiveSummary | None=None
    
    risf: dict[str, Any] = Field(
        ...,
        description="Overall RISF evaluation.",
    )

    recommendations: list[Recommendation] = Field(
        default_factory=list,
        description="Prioritized research recommendations.",
    )

    simulation: dict[str, Any] = Field(
        default_factory=dict,
        description="Research improvement simulations.",
    )

    metadata: dict[str, Any] = Field(
        default_factory=dict,
        description="Pipeline execution metadata.",
    )
    

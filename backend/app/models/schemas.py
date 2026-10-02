from typing import List, Optional
from pydantic import BaseModel, Field


# ==========================================================
# Input
# ==========================================================

class ResearchIdea(BaseModel):
    title: str = Field(..., description="Research idea title")
    description: str = Field(..., description="Detailed research idea")

# ==========================================================
# AI Paper Summary
# ==========================================================

class PaperSummary(BaseModel):
    title: str

    objective: str

    methodology: str

    key_contributions: List[str] = []

    limitations: List[str] = []

    future_work: List[str] = []

    datasets: List[str] = []

    keywords: List[str] = []

    evaluation_metrics: List[str] = []
# ==========================================================
# Paper
# ==========================================================

class Paper(BaseModel):
    title: str
    authors: List[str] = []
    abstract: str

    summary: Optional[PaperSummary] = None

    year: Optional[int] = None
    source: str
    url: Optional[str] = None
    citations: Optional[int] = None
    similarity_score: Optional[float] = None
    venue: Optional[str] = None

# ==========================================================
# Research Understanding
# ==========================================================

class ResearchUnderstanding(BaseModel):
    domain: str
    research_problem: str
    research_objective: str
    methodology: str
    application_area: str
    data_type: str
    keywords: List[str]
    research_questions: List[str]
    expected_contribution: str


# ==========================================================
# Novelty
# ==========================================================

class NoveltyResult(BaseModel):
    score: float
    level: str
    explanation: str


# ==========================================================
# Saturation
# ==========================================================

class SaturationResult(BaseModel):
    score: float

    level: str

    confidence: float

    explanation: str

    total_papers: int

    recent_papers: int

    average_citations: float

    yearly_growth: float


# ==========================================================
# Research Gap
# ==========================================================

class ResearchGap(BaseModel):
    title: str
    category: str
    description: str
    evidence: list[str]

    supporting_papers: list[str]

    research_opportunity: str

    confidence: float

# ==========================================================
# Trend
# ==========================================================

class TrendPrediction(BaseModel):
    trend_score: float

    trend: str

    confidence: float

    yearly_distribution: dict[int, int]

    explanation: str

# ==========================================================
# Dataset
# ==========================================================

class DatasetAnalysis(BaseModel):
    available: bool
    datasets: List[str]
    remarks: str


# ==========================================================
# Publishability
# ==========================================================

class Publishability(BaseModel):
    score: float
    explanation: str
    target_conference: Optional[str] = None


# ==========================================================
# Refined Idea
# ==========================================================

class RefinedIdea(BaseModel):
    title: str
    description: str
    improvements: List[str]


# ==========================================================
# Final Report
# ==========================================================

class ResearchReport(BaseModel):
    understanding: ResearchUnderstanding

    papers: List[Paper]

    novelty: NoveltyResult

    saturation: SaturationResult

    gaps: List[ResearchGap]

    trends: List[TrendPrediction]

    datasets: DatasetAnalysis

    publishability: Publishability

    refined_idea: RefinedIdea
    
# RISF
class RISFMetric(BaseModel):

    name: str

    score: float = Field(ge=0, le=100)

    confidence: float = Field(ge=0, le=1)

    reasoning: str

    evidence: list[str] = []

    metadata: dict = {}
    
class AISummary(BaseModel):

    research_landscape: str

    dominant_methods: list[str] = Field(default_factory=list)

    major_findings: list[str] = Field(default_factory=list)

    current_limitations: list[str] = Field(default_factory=list)

    future_direction: str

    overall_opportunity: str
    

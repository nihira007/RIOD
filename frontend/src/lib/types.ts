/**
 * Types mirror the backend contract exactly:
 *   backend/app/models/schemas.py
 *   backend/app/models/pipeline_result.py
 *   backend/app/models/api_response.py
 *   backend/app/framework/{scoring,evidence,recommendation,simulator}.py
 *
 * `metadata` fields are typed loosely on purpose -- they are untyped
 * `dict`s on the Python side too, produced by ~20 different analysis
 * sub-modules. Components that read into `metadata` do so defensively.
 */

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------

export interface ResearchIdea {
    title: string;
    description: string;
}

// ---------------------------------------------------------------------------
// AI Paper Summary
// ---------------------------------------------------------------------------

export interface PaperSummary {
    objective: string;
    methodology: string;
    key_contributions: string[];
    why_it_matters: string;
}

// ---------------------------------------------------------------------------
// Literature
// ---------------------------------------------------------------------------

export interface Paper {
    title: string;
    authors: string[];
    abstract: string;

    summary?: PaperSummary;     

    year?: number | null;
    source: string;
    url?: string | null;
    citations?: number | null;
    similarity_score?: number | null;
    venue?: string | null;
}

// ---------------------------------------------------------------------------
// Idea understanding
// ---------------------------------------------------------------------------
export interface ExecutiveSummary {

    overall_score: number;

    verdict: string;

    confidence: number;

    summary: string;

    strengths: string[];

    weaknesses: string[];

    recommendation: string;

}

export interface ResearchUnderstanding {
    domain: string;
    research_problem: string;
    research_objective: string;
    methodology: string;
    application_area: string;
    data_type: string;
    keywords: string[];
    research_questions: string[];
    expected_contribution: string;
}

// ---------------------------------------------------------------------------
// Evidence & RISF metrics (app/framework/scoring.py, evidence.py)
// ---------------------------------------------------------------------------

export interface Evidence {
    title: string;
    description: string;
    source: string;
    confidence: number;
    paper_title?: string | null;
    paper_id?: string | null;
    url?: string | null;
    metadata?: Record<string, unknown>;
}

export type MetricName = "Novelty" | "Saturation" | "Trend" | "Research Gap";

export interface RISFMetric {
    name: MetricName;
    score: number;
    confidence: number;
    reasoning: string;
    evidence: Evidence[];
    metadata: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// RISF overall evaluation (app/framework/risf.py)
// ---------------------------------------------------------------------------

export type Verdict = "Excellent" | "Strong" | "Moderate" | "Weak" | "Poor";

export interface RISFResult {
    overall_score: number;
    confidence: number;
    verdict: Verdict;
    details: Record<string, { score: number; confidence: number }>;
    top_evidence: Evidence[];
    reasoning: string;
}

// ---------------------------------------------------------------------------
// Recommendations & simulation (app/framework/recommendation.py, simulator.py)
// ---------------------------------------------------------------------------

export type Priority = "High" | "Medium" | "Low";

export interface Recommendation {
    priority: Priority;
    category: string;
    title: string;
    description: string;
    based_on: string;
}

export interface SimulationResult {
    scenario: string;
    predicted_score: number;
    improvement: number;
    explanation: string;
}

export interface Simulation {
    current_score: number;
    best_possible_score: number;
    simulations: SimulationResult[];
}

// ---------------------------------------------------------------------------
// Pipeline result (app/models/pipeline_result.py)
// ---------------------------------------------------------------------------

export interface PipelineMetadata {
    execution_time: number;
    papers_retrieved: number;
    version: string;
}

export interface ResearchPipelineResult {
    understanding: ResearchUnderstanding;
    papers: Paper[];
    executive_summary: ExecutiveSummary;
    novelty: RISFMetric;
    saturation: RISFMetric;
    trend: RISFMetric;
    gap: RISFMetric;
    risf: RISFResult;
    recommendations: Recommendation[];
    simulation: Simulation;
    metadata: PipelineMetadata;
}

// ---------------------------------------------------------------------------
// Envelope (app/models/api_response.py)
// ---------------------------------------------------------------------------

export interface APIResponse<T> {
    success: boolean;
    message: string;
    data?: T | null;
    errors: string[];
}

// ---------------------------------------------------------------------------
// Locally-persisted records (client-side only -- the backend has no
// persistence layer, so saved reports/history live in the browser)
// ---------------------------------------------------------------------------

export interface SavedReport {
    id: string;
    createdAt: string;
    idea: ResearchIdea;
    result: ResearchPipelineResult;
}

// ---------------------------------------------------------------------------
// Metadata sub-shapes actually produced by the analysis engines.
// These are read defensively (backend types them as `dict`), but knowing
// the real shape lets the report page chart genuine pipeline output
// instead of inventing numbers.
// ---------------------------------------------------------------------------

export interface NoveltyMetadata {
    semantic?: number;
    methodology?: { score: number; occurrences: number; supporting_papers: string[]; distribution?: Record<string, number> };
    dataset?: { score: number; datasets: string[]; dataset_usage?: Record<string, number>; reasoning: string };
    application?: { score: number; occurrences: number; supporting_papers: string[]; reasoning: string };
    temporal?: { score: number; average_age: number; recent_papers: number; reasoning: string };
}

export interface SaturationMetadata {
    publication_density?: { score: number; total_papers: number; papers_per_year: number; recent_ratio: number; year_distribution: Record<string, number>; reasoning: string };
    citation_density?: { score: number; average_citations: number; median_citations: number; max_citations: number; highly_cited_ratio: number; reasoning: string };
    venue_quality?: { score: number; average_venue_score: number; top_venues: [string, number][]; reasoning: string };
    research_velocity?: { score: number; growth_rate: number; acceleration: number; cagr: number; trend: string; year_distribution: Record<string, number>; reasoning: string };
    competition_index?: { score: number; unique_authors: number; average_authors: number; repeat_author_ratio: number; collaboration_score: number; reasoning: string };
}

export interface KeywordItem {
    keyword: string;
    count: number;
    papers: number;
}

export type EvolutionEntry = [string, { timeline: Record<string, number>; growth: number; trend: string }];

export interface TrendMetadata {
    publication?: { score: number; growth_rate: number; recent_ratio: number; trend: string; year_distribution: Record<string, number>; reasoning: string };
    keywords?: { keywords: KeywordItem[]; total_keywords: number; reasoning: string };
    keyword_evolution?: { top_growing: EvolutionEntry[]; all_keywords: Record<string, { timeline: Record<string, number>; growth: number; trend: string }>; reasoning: string };
    topic_evolution?: { topics: Record<string, { timeline: Record<string, number>; growth: number; trend: string }>; top_topics: EvolutionEntry[]; reasoning: string };
    forecast?: { forecast: Record<string, number>; slope: number; trend: string; confidence: number; reasoning: string };
    emerging_topics?: { emerging_topics: { type: string; name: string; growth: number; trend: string; confidence: number }[]; future_growth: number; future_trend: string; reasoning: string };
}

export interface GapScoreItem {
    
    title: string;

    category?: string;

    explanation?: string;

    research_opportunity?: string;

    supporting_papers?: string[];

    evidence_points?: string[];

    confidence?: number;

    score: number;

    novelty: number;
    impact: number;
    feasibility: number;
    evidence: number;
}

export interface GapMetadata {
    ai_summary?: AISummary;
    limitations?: { limitations: unknown[]; limitation_frequency: string[]; reasoning: string };
    future_work?: { future_work: unknown[]; future_work_frequency: string[]; reasoning: string };
    contradictions?: { contradictions: { paper_1: string; paper_2: string; confidence: number }[]; count: number; reasoning: string };
    ranking?: { top_gap: GapScoreItem | null; ranked_gaps: GapScoreItem[]; reasoning: string };
}

export interface AISummary {

    research_landscape: string;

    dominant_methods: string[];

    major_findings: string[];

    current_limitations: string[];

    future_direction: string;

    overall_opportunity: string;

}
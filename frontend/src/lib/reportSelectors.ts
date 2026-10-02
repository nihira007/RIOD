import type {
    RISFMetric,
    NoveltyMetadata,
    SaturationMetadata,
    TrendMetadata,
    GapMetadata,
    GapScoreItem,
} from "./types";
import type { RadarPoint } from "@/components/charts/RadarBreakdown";
import type { TimelinePoint } from "@/components/charts/PublicationTimeline";
import type { BarPoint } from "@/components/charts/KeywordBarChart";

function meta<T>(metric: RISFMetric): T {
    return (metric.metadata ?? {}) as T;
}

export function noveltyRadar(metric: RISFMetric): RadarPoint[] {
    const m = meta<NoveltyMetadata>(metric);
    return [
        { axis: "Semantic", value: m.semantic ?? 0 },
        { axis: "Methodology", value: m.methodology?.score ?? 0 },
        { axis: "Dataset", value: m.dataset?.score ?? 0 },
        { axis: "Application", value: m.application?.score ?? 0 },
        { axis: "Temporal", value: m.temporal?.score ?? 0 },
    ];
}

export function saturationRadar(metric: RISFMetric): RadarPoint[] {
    const m = meta<SaturationMetadata>(metric);
    return [
        { axis: "Publication", value: m.publication_density?.score ?? 0 },
        { axis: "Citation", value: m.citation_density?.score ?? 0 },
        { axis: "Venue", value: m.venue_quality?.score ?? 0 },
        { axis: "Velocity", value: m.research_velocity?.score ?? 0 },
        { axis: "Competition", value: m.competition_index?.score ?? 0 },
    ];
}

export function publicationTimeline(metric: RISFMetric): TimelinePoint[] {
    const m = meta<TrendMetadata>(metric);
    const historical = m.publication?.year_distribution ?? {};
    const forecast = m.forecast?.forecast ?? {};

    const years = Array.from(new Set([...Object.keys(historical), ...Object.keys(forecast)])).sort();

    return years.map((year) => ({
        year,
        published: historical[year],
        forecast: forecast[year],
    }));
}

export function topGrowingKeywords(metric: RISFMetric, limit = 8): BarPoint[] {
    const m = meta<TrendMetadata>(metric);
    const entries = m.keyword_evolution?.top_growing ?? [];
    return entries
        .filter(([, info]) => info.growth > 0)
        .slice(0, limit)
        .map(([keyword, info]) => ({ name: keyword, value: info.growth }));
}

export function keywordFrequency(metric: RISFMetric, limit = 8): BarPoint[] {
    const m = meta<TrendMetadata>(metric);
    const items = m.keywords?.keywords ?? [];
    return items.slice(0, limit).map((k) => ({ name: k.keyword, value: k.count }));
}

export function emergingTopics(metric: RISFMetric) {
    const m = meta<TrendMetadata>(metric);
    return m.emerging_topics?.emerging_topics ?? [];
}

export function rankedGaps(metric: RISFMetric): GapScoreItem[] {
    const m = meta<GapMetadata>(metric);

    const ranked = m.ranking?.ranked_gaps ?? [];

    return ranked.map((gap: any) => ({
        title: gap.title,

        category: gap.category,

        explanation: gap.explanation ?? gap.description ?? "",

        novelty: gap.novelty ?? 0,
        impact: gap.impact ?? 0,
        feasibility: gap.feasibility ?? 0,
        evidence: gap.evidence ?? 0,
        score: gap.score ?? 0,
    }));
}

export function gapContradictions(metric: RISFMetric) {
    const m = meta<GapMetadata>(metric);
    return m.contradictions?.contradictions ?? [];
}

export function limitationFrequency(metric: RISFMetric): string[] {
    const m = meta<GapMetadata>(metric);
    const freq = m.limitations?.limitation_frequency ?? [];
    return Array.isArray(freq) ? freq : Object.keys(freq as unknown as Record<string, unknown>);
}

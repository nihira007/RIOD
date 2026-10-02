import { Card, Badge } from "@/components/common/Card";
import type { AISummary, GapScoreItem } from "@/lib/types";

const dims = [
    { key: "novelty", label: "Novelty" },
    { key: "impact", label: "Impact" },
    { key: "feasibility", label: "Feasibility" },
    { key: "evidence", label: "Evidence" },
] as const;

export default function GapList({
    gaps,
    summary,
}: {
    gaps: GapScoreItem[];
    summary?: AISummary;
}) {
    if (!gaps.length) {
        return (
            <p className="text-sm text-muted">
                No distinct research gaps were identified.
            </p>
        );
    }

    return (
        <>
        {summary && (
        <Card className="p-6 mb-6 space-y-6">

            <div>

                <h2 className="text-xl font-bold">
                    AI Literature Analysis
                </h2>

                <p className="text-sm text-muted mt-1">
                    AI-generated synthesis of the retrieved literature.
                </p>

            </div>

            {/* Research Landscape */}

            <div>

                <h3 className="font-semibold mb-2">
                    Research Landscape
                </h3>

                <p className="text-sm leading-relaxed text-muted">
                    {summary.research_landscape}
                </p>

            </div>

            {/* Dominant Methods */}

            {summary.dominant_methods.length > 0 && (

                <div>

                    <h3 className="font-semibold mb-2">
                        Dominant Methods
                    </h3>

                    <div className="flex flex-wrap gap-2">

                        {summary.dominant_methods.map((method, i) => (

                            <Badge
                                key={i}
                                tone="brand"
                            >
                                {method}
                            </Badge>

                        ))}

                    </div>

                </div>

            )}

            {/* Major Findings */}

            {summary.major_findings.length > 0 && (

                <div>

                    <h3 className="font-semibold mb-2">
                        Major Findings
                    </h3>

                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted">

                        {summary.major_findings.map((finding, i) => (

                            <li key={i}>{finding}</li>

                        ))}

                    </ul>

                </div>

            )}

            {/* Current Limitations */}

            {summary.current_limitations.length > 0 && (

                <div>

                    <h3 className="font-semibold mb-2">
                        Current Limitations
                    </h3>

                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted">

                        {summary.current_limitations.map((item, i) => (

                            <li key={i}>{item}</li>

                        ))}

                    </ul>

                </div>

            )}

            {/* Future Direction */}

            <div>

                <h3 className="font-semibold mb-2">
                    Future Research Direction
                </h3>

                <p className="text-sm text-muted leading-relaxed">
                    {summary.future_direction}
                </p>

            </div>

            {/* Opportunity */}

            <div className="rounded-xl border border-brand/20 bg-brand/5 p-4">

                <p className="text-xs font-semibold uppercase tracking-wide text-brand mb-2">
                    Overall Research Opportunity
                </p>

                <p className="text-sm leading-relaxed">
                    {summary.overall_opportunity}
                </p>

            </div>

        </Card>
    )}

        <div className="space-y-4">
            <h2 className="text-xl font-bold">
                Extracted Research Gaps
            </h2>
            {gaps.slice(0, 5).map((gap, i) => (
                <Card
                    key={i}
                    className="p-5 space-y-4"
                >
                    {/* Header */}

                    <div className="flex items-start justify-between">

                        <div>

                            <h3 className="text-base font-semibold">
                                {gap.title}
                            </h3>

                            {gap.category && (
                                <Badge tone="neutral">
                                    {gap.category}
                                </Badge>
                            )}

                        </div>

                        <Badge tone="brand">
                            {gap.score.toFixed(0)}
                        </Badge>

                    </div>

                    {/* Description */}

                    {gap.explanation && (
                        <p className="text-sm leading-relaxed text-muted">
                            {gap.explanation}
                        </p>
                    )}

                    {/* Evidence */}

                    {gap.evidence_points &&
                        gap.evidence_points.length > 0 && (
                            <div>

                                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                                    Supporting Evidence
                                </p>

                                <ul className="list-disc pl-5 text-sm space-y-1 text-muted">

                                    {gap.evidence_points.map((item, idx) => (
                                        <li key={idx}>
                                            {item}
                                        </li>
                                    ))}

                                </ul>

                            </div>
                        )}

                    {/* Supporting Papers */}

                    {gap.supporting_papers &&
                        gap.supporting_papers.length > 0 && (
                            <div>

                                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                                    Supporting Papers
                                </p>

                                <div className="flex flex-wrap gap-2">

                                    {gap.supporting_papers.map((paper, idx) => (
                                        <Badge
                                            key={idx}
                                            tone="neutral"
                                        >
                                            {paper}
                                        </Badge>
                                    ))}

                                </div>

                            </div>
                        )}

                    {/* Research Opportunity */}

                    {gap.research_opportunity && (
                        <div className="rounded-xl border border-brand/20 bg-brand/5 p-4">

                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand">
                                Research Opportunity
                            </p>

                            <p className="text-sm leading-relaxed">
                                {gap.research_opportunity}
                            </p>

                        </div>
                    )}

                    {/* Scores */}

                    <div className="grid grid-cols-4 gap-3">

                        {dims.map((d) => (
                            <div key={d.key}>

                                <div className="h-1.5 rounded-full bg-surface overflow-hidden">

                                    <div
                                        className="h-full rounded-full bg-violet"
                                        style={{
                                            width: `${Math.round(
                                                Number(gap[d.key]) * 100
                                            )}%`,
                                        }}
                                    />

                                </div>

                                <p className="mt-1 text-[10px] text-center text-muted">
                                    {d.label}
                                </p>

                            </div>
                        ))}

                    </div>
                </Card>
            ))}
        </div>
        </>
    );
}
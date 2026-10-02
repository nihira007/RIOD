import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
    Sparkles,
    Layers,
    TrendingUp,
    GitBranch,
    ArrowLeft,
    Clock,
    FileStack,
    Tag,
} from "lucide-react";

import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, Eyebrow, Badge } from "@/components/common/Card";
import ScoreSeal from "@/components/common/ScoreSeal";
import MetricBar from "@/components/common/MetricBar";
import EvidenceList from "@/components/common/EvidenceList";
import PaperCard from "@/components/common/PaperCard";
import { EmptyState } from "@/components/common/EmptyState";
import MetricSection from "@/components/report/MetricSection";
import RecommendationList from "@/components/report/RecommendationList";
import GapList from "@/components/report/GapList";
import RadarBreakdown from "@/components/charts/RadarBreakdown";
import PublicationTimeline from "@/components/charts/PublicationTimeline";
import KeywordBarChart from "@/components/charts/KeywordBarChart";
import { useReportStore } from "@/lib/store";
import {
    noveltyRadar,
    saturationRadar,
    publicationTimeline,
    topGrowingKeywords,
    emergingTopics,
    rankedGaps,
} from "@/lib/reportSelectors";
import { timeAgo } from "@/lib/utils";
import type { AISummary } from "@/lib/types";

const jumpLinks = [
    { href: "#overview", label: "Overview" },
    { href: "#literature", label: "Literature" },
    { href: "#understanding", label: "Research DNA" },
    { href: "#novelty", label: "Novelty" },
    { href: "#saturation", label: "Saturation" },
    { href: "#trend", label: "Trend" },
    { href: "#gap", label: "Research Gap" },
    { href: "#recommendations", label: "Recommendations" },
];

export default function Report() {
    const { id } = useParams();
    const { getReport } = useReportStore();
    const report = id ? getReport(id) : undefined;

    const noveltyData = useMemo(() => (report ? noveltyRadar(report.result.novelty) : []), [report]);
    const saturationData = useMemo(() => (report ? saturationRadar(report.result.saturation) : []), [report]);
    const timelineData = useMemo(() => (report ? publicationTimeline(report.result.trend) : []), [report]);
    const growingKeywords = useMemo(() => (report ? topGrowingKeywords(report.result.trend) : []), [report]);
    const emerging = useMemo(() => (report ? emergingTopics(report.result.trend) : []), [report]);
    const gaps = useMemo(() => (report ? rankedGaps(report.result.gap) : []), [report]);

    if (!report) {
        return (
            <DashboardLayout>
                <EmptyState
                    icon={<FileStack size={28} />}
                    title="Report not found"
                    description="This report isn't in your local history — it may have been cleared, or the link belongs to a different browser."
                    actionLabel="Start a new analysis"
                    actionTo="/analyze"
                />
            </DashboardLayout>
        );
    }

    const { result } = report;
    const { understanding, risf, recommendations, papers, metadata } = result;

    return (
        <DashboardLayout>
            <div id="print-root">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <Link
                            to="/reports"
                            className="no-print mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-foreground"
                        >
                            <ArrowLeft size={13} /> All reports
                        </Link>
                        <Eyebrow className="mb-1.5">{understanding.domain}</Eyebrow>
                        <h1 className="font-display text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
                            {report.idea.title}
                        </h1>
                        <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                            <span className="inline-flex items-center gap-1">
                                <Clock size={12} /> Analyzed {timeAgo(report.createdAt)}
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <FileStack size={12} /> {metadata.papers_retrieved} papers retrieved
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <Tag size={12} /> {metadata.execution_time}s pipeline runtime
                            </span>
                        </p>
                    </div>
                </div>

                {/* Jump nav */}
                <div className="no-print mb-8 flex flex-wrap gap-2">
                    {jumpLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-brand/50 hover:text-foreground"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Overview */}
                <Card className="mb-8 overflow-hidden p-0">
                    <div className="grid grid-cols-1 gap-8 p-6 sm:p-8 lg:grid-cols-[auto_1fr]">
                        <div className="flex flex-col items-center gap-3 lg:items-start">
                            <ScoreSeal score={risf.overall_score} verdict={risf.verdict} confidence={risf.confidence} />
                        </div>

                        <div>
                            <Eyebrow className="mb-2">RISF verdict</Eyebrow>
                            <p className="max-w-2xl text-sm leading-relaxed text-muted">{risf.reasoning}</p>

                            <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                                <MetricBar label="Novelty" score={result.novelty.score} confidence={result.novelty.confidence} tone="brand" />
                                <MetricBar label="Saturation" score={result.saturation.score} confidence={result.saturation.confidence} tone="teal" />
                                <MetricBar label="Trend" score={result.trend.score} confidence={result.trend.confidence} tone="violet" />
                                <MetricBar label="Research Gap" score={result.gap.score} confidence={result.gap.confidence} tone="rust" />
                            </div>
                        </div>
                    </div>
                </Card>
                
                
                {/* Idea understanding */}
                <Card className="mb-8 p-6 sm:p-8">
                    <Eyebrow className="mb-4">Idea understanding</Eyebrow>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <Field label="Research problem" value={understanding.research_problem} />
                        <Field label="Research objective" value={understanding.research_objective} />
                        <Field label="Methodology" value={understanding.methodology} />
                        <Field label="Application area" value={understanding.application_area} />
                        <Field label="Data type" value={understanding.data_type} />
                        <Field label="Expected contribution" value={understanding.expected_contribution} />
                    </div>

                    {understanding.keywords.length > 0 && (
                        <div className="mt-6">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Keywords</p>
                            <div className="flex flex-wrap gap-2">
                                {understanding.keywords.map((k) => (
                                    <Badge key={k} tone="neutral">
                                        {k}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {understanding.research_questions.length > 0 && (
                        <div className="mt-6">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                                Research questions
                            </p>
                            <ul className="list-disc space-y-1.5 pl-4 text-sm text-muted">
                                {understanding.research_questions.map((q, i) => (
                                    <li key={i}>{q}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </Card>

                {/* Metric deep-dives */}
                <div className="space-y-8">
                    <MetricSection
                        id="novelty"
                        icon={Sparkles}
                        metric={result.novelty}
                        tone="brand"
                        chart={<RadarBreakdown data={noveltyData} color="hsl(var(--brand))" />}
                    />

                    <MetricSection
                        id="saturation"
                        icon={Layers}
                        metric={result.saturation}
                        tone="teal"
                        chart={<RadarBreakdown data={saturationData} color="hsl(var(--accent-teal))" />}
                    />

                    <MetricSection
                        id="trend"
                        icon={TrendingUp}
                        metric={result.trend}
                        tone="violet"
                        chart={
                            timelineData.length > 0 ? (
                                <PublicationTimeline data={timelineData} />
                            ) : (
                                <p className="text-sm text-muted">Not enough dated papers to chart a timeline.</p>
                            )
                        }
                        extra={
                            <div className="mt-6 space-y-6">
                                {growingKeywords.length > 0 && (
                                    <div>
                                        <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-wide text-muted">
                                            Fastest-growing keywords
                                        </p>
                                        <KeywordBarChart data={growingKeywords} valueLabel="Growth" />
                                    </div>
                                )}
                                {emerging.length > 0 && (
                                    <div>
                                        <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-wide text-muted">
                                            Emerging topics
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {emerging.slice(0, 10).map((t, i) => (
                                                <Badge key={i} tone={t.type === "Topic" ? "violet" : "brand"}>
                                                    {t.name} · +{t.growth}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        }
                    />

                    <MetricSection
                        id="gap"
                        icon={GitBranch}
                        metric={result.gap}
                        tone="rust"
                        chart={
                            <GapList
                                gaps={gaps}
                                summary={
                                    (result.gap.metadata as Record<string, unknown>)
                                        .ai_summary as AISummary | undefined
                                }
                            />
                        }
                    />
                </div>

                {/* Literature */}
                <section id="literature" className="mt-10 scroll-mt-24">
                    <div className="mb-4 flex items-center justify-between">
                        <Eyebrow>
                            Supporting Literature ({papers.length})
                        </Eyebrow>

                        <Link
                            to={`/literature/${report.id}`}
                            className="text-sm font-medium text-brand transition-colors hover:text-brand/80 hover:underline"
                        >
                            View All →
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {papers.map((paper, i) => (
                            <PaperCard key={i} paper={paper} id={`${report.id}::${i}`} compact />
                        ))}
                    </div>
                </section>

                {/* RISF top evidence */}
                {risf.top_evidence.length > 0 && (
                    <section className="mt-10">
                        <Eyebrow className="mb-4">Highest-confidence evidence overall</Eyebrow>
                        <EvidenceList evidence={risf.top_evidence} limit={8} />
                    </section>
                )}

                {/* Recommendations */}
                <section id="recommendations" className="mt-10 scroll-mt-24">
                    <Eyebrow className="mb-4">Recommendations</Eyebrow>
                    <RecommendationList recommendations={recommendations} />
                </section>

                <p className="no-print mt-10 text-center text-xs text-muted">
                    Pipeline v{metadata.version} · {metadata.execution_time}s runtime · {metadata.papers_retrieved} papers
                </p>
            </div>
        </DashboardLayout>
    );
}

function Field({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
            <p className="mt-1 text-sm leading-relaxed text-foreground">{value}</p>
        </div>
    );
}

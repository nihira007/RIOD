import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, CalendarDays, Quote, Percent, BookOpen } from "lucide-react";

import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, Eyebrow, Badge } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import PaperCard from "@/components/common/PaperCard";
import { useReportStore } from "@/lib/store";
import { timeAgo } from "@/lib/utils";

export default function PaperDetails() {
    const { id } = useParams();
    const { allPapers, getReport } = useReportStore();

    const paper = allPapers.find((p) => p.id === decodeURIComponent(id ?? ""));

    if (!paper) {
        return (
            <DashboardLayout>
                <EmptyState
                    icon={<BookOpen size={24} />}
                    title="Paper not found"
                    description="This paper isn't in your local literature index. It may belong to a report that was cleared."
                    actionLabel="Open Literature Explorer"
                    actionTo="/literature"
                />
            </DashboardLayout>
        );
    }

    const report = getReport(paper.reportId);
    const related = allPapers.filter((p) => p.reportId === paper.reportId && p.id !== paper.id).slice(0, 3);

    const stats = [
        { icon: CalendarDays, label: "Year", value: paper.year ?? "Unknown" },
        { icon: Quote, label: "Citations", value: paper.citations ?? "—" },
        {
            icon: Percent,
            label: "Similarity",
            value: typeof paper.similarity_score === "number" ? `${Math.round(paper.similarity_score * 100)}%` : "—",
        },
    ];

    return (
        <DashboardLayout>
            <Link
                to="/literature"
                className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-foreground"
            >
                <ArrowLeft size={13} /> Literature Explorer
            </Link>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
                <Card className="p-6 sm:p-8">
                    <Badge tone="neutral" className="mb-4">
                        {paper.source}
                    </Badge>
                    <h1 className="font-display text-2xl font-semibold leading-tight text-foreground">
                        {paper.title}
                    </h1>
                    <p className="mt-2.5 text-sm text-muted">{paper.authors.join(", ") || "Authors not listed"}</p>
                    {paper.venue && <p className="mt-1 text-sm italic text-muted">{paper.venue}</p>}

                    <div className="mt-6 grid grid-cols-3 gap-4 border-y border-border py-5">
                        {stats.map((s) => (
                            <div key={s.label}>
                                <s.icon size={14} className="text-muted" />
                                <p className="mt-1.5 font-mono text-lg font-semibold tabular text-foreground">
                                    {s.value}
                                </p>
                                <p className="text-xs text-muted">{s.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 space-y-5">

                        <div>
                            <Eyebrow className="mb-3">Research Insight</Eyebrow>

                            {paper.summary ? (

                                <div className="space-y-5">

                                    <div>
                                        <h3 className="text-sm font-semibold text-foreground">
                                            🎯 Objective
                                        </h3>

                                        <p className="mt-1 text-sm leading-relaxed text-muted">
                                            {paper.summary.objective}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-semibold text-foreground">
                                            ⚙️ Methodology
                                        </h3>

                                        <p className="mt-1 text-sm leading-relaxed text-muted">
                                            {paper.summary.methodology}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-semibold text-foreground">
                                            ⭐ Key Contributions
                                        </h3>

                                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
                                            {paper.summary.key_contributions.map((item: string, index: number) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                                        <h3 className="text-sm font-semibold text-blue-700">
                                            💡 Why This Paper Matters
                                        </h3>

                                        <p className="mt-2 text-sm leading-relaxed text-slate-700">
                                            {paper.summary.why_it_matters}
                                        </p>
                                    </div>

                                </div>

                            ) : (

                                <p className="text-sm text-muted">
                                    AI summary not available.
                                </p>

                            )}
                        </div>


                    </div>

                    {paper.url && (
                        <a
                            href={paper.url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
                        >
                            Open source <ExternalLink size={13} />
                        </a>
                    )}
                </Card>

                <div className="space-y-5">
                    {report && (
                        <Card className="p-5">
                            <Eyebrow className="mb-3">Retrieved via</Eyebrow>
                            <Link to={`/report/${report.id}`} className="block">
                                <p className="text-sm font-semibold text-foreground hover:text-brand">
                                    {report.idea.title}
                                </p>
                            </Link>
                            <p className="mt-1 text-xs text-muted">{timeAgo(report.createdAt)}</p>
                        </Card>
                    )}

                    {related.length > 0 && (
                        <div>
                            <Eyebrow className="mb-3">From the same analysis</Eyebrow>
                            <div className="space-y-3">
                                {related.map((p) => (
                                    <PaperCard key={p.id} paper={p} id={p.id} compact />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

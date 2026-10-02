import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Search, BookOpen, SlidersHorizontal } from "lucide-react";

import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, Eyebrow, Badge } from "@/components/common/Card";
import PaperCard from "@/components/common/PaperCard";
import { EmptyState } from "@/components/common/EmptyState";
import { useReportStore } from "@/lib/store";

type SortKey = "similarity" | "year" | "citations" | "title";

export default function Literature() {
    const { reportId } = useParams();
    const { allPapers, reports, getReport } = useReportStore();
    const [query, setQuery] = useState("");
    const [source, setSource] = useState<string>("all");
    const [sort, setSort] = useState<SortKey>("similarity");

    const report = reportId ? getReport(reportId) : undefined;

    const papers = report?.result.papers ?? allPapers;

    const sources = useMemo(
        () => Array.from(new Set(papers.map((p) => p.source))).sort(),
        [papers]
    );

    const filtered = useMemo(() => {
        let list = papers;

        if (query.trim()) {
            const q = query.trim().toLowerCase();

            list = list.filter(
                (p) =>
                    p.title.toLowerCase().includes(q) ||
                    p.abstract.toLowerCase().includes(q) ||
                    p.authors.some((a) => a.toLowerCase().includes(q))
            );
        }

        if (source !== "all") {
            list = list.filter((p) => p.source === source);
        }

        return [...list].sort((a, b) => {
            switch (sort) {
                case "year":
                    return (b.year ?? 0) - (a.year ?? 0);

                case "citations":
                    return (b.citations ?? 0) - (a.citations ?? 0);

                case "title":
                    return a.title.localeCompare(b.title);

                case "similarity":
                default:
                    return (b.similarity_score ?? 0) - (a.similarity_score ?? 0);
            }
        });
    }, [papers, query, source, sort]);

    if (papers.length === 0) {
        return (
            <DashboardLayout>
                <Eyebrow className="mb-2">Supporting Literature</Eyebrow>

                <h1 className="mb-8 font-display text-2xl font-semibold text-foreground sm:text-3xl">
                    No literature available
                </h1>

                <EmptyState
                    icon={<BookOpen size={24} />}
                    title="No papers found"
                    description="Run an analysis first to retrieve supporting literature."
                    actionLabel="Analyze an idea"
                    actionTo="/analyze"
                />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="mb-6 flex flex-col gap-3">
                <Eyebrow>Supporting Literature</Eyebrow>

                <h1 className="font-display text-3xl font-semibold text-foreground">
                    {reportId
                        ? "Papers retrieved for this analysis"
                        : "Retrieved Literature"}
                </h1>

                <p className="text-sm text-muted">
                    {reportId
                        ? `${papers.length} papers supporting this report.`
                        : `${papers.length} unique papers across ${reports.length} saved analyses.`}
                </p>

                {report && (
                    <Badge tone="neutral">
                        {report.idea?.title ?? "Current Report"}
                    </Badge>
                )}
            </div>

            <Card className="mb-6 flex flex-col gap-3.5 p-4 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search
                        size={15}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                    />

                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search title, abstract, or author..."
                        className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-3.5 text-sm text-foreground placeholder:text-muted/60 focus:border-brand"
                    />
                </div>

                <div className="flex items-center gap-2.5">
                    <SlidersHorizontal
                        size={14}
                        className="hidden text-muted sm:block"
                    />

                    <select
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground"
                    >
                        <option value="all">All sources</option>

                        {sources.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>

                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as SortKey)}
                        className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground"
                    >
                        <option value="similarity">Similarity</option>
                        <option value="year">Newest</option>
                        <option value="citations">Most cited</option>
                        <option value="title">Title A–Z</option>
                    </select>
                </div>
            </Card>

            <div className="mb-4">
                <Badge tone="neutral">{filtered.length} papers</Badge>
            </div>

            {filtered.length === 0 ? (
                <EmptyState
                    icon={<Search size={22} />}
                    title="No matching papers"
                    description="Try a different search term or source filter."
                />
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((paper, index) => (
                        <PaperCard
                            key={`${reportId ?? "all"}-${index}`}
                            paper={paper}
                            id={`${reportId ?? "all"}::${index}`}
                        />
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}
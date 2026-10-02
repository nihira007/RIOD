import { useState } from "react";
import { Link } from "react-router-dom";
import { FileStack, Trash2, ArrowRight, Plus } from "lucide-react";

import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, Eyebrow, Badge } from "@/components/common/Card";
import Button from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";
import CompactScore from "@/components/common/CompactScore";
import { useReportStore } from "@/lib/store";
import { timeAgo } from "@/lib/utils";
import type { Verdict } from "@/lib/types";

export default function Reports() {
    const { reports, deleteReport, clearReports } = useReportStore();
    const [confirmClear, setConfirmClear] = useState(false);

    return (
        <DashboardLayout>
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <Eyebrow className="mb-2">Saved reports</Eyebrow>
                    <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
                        Your analysis history
                    </h1>
                    <p className="mt-1.5 text-sm text-muted">
                        Stored locally in this browser — {reports.length} saved.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    {reports.length > 0 &&
                        (confirmClear ? (
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted">Clear all history?</span>
                                <Button size="sm" variant="secondary" onClick={() => setConfirmClear(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    className="!bg-rust !text-white"
                                    onClick={() => {
                                        clearReports();
                                        setConfirmClear(false);
                                    }}
                                >
                                    Confirm
                                </Button>
                            </div>
                        ) : (
                            <Button variant="secondary" size="sm" onClick={() => setConfirmClear(true)}>
                                <Trash2 size={14} /> Clear all
                            </Button>
                        ))}
                    <Link to="/analyze">
                        <Button size="sm">
                            <Plus size={14} /> New analysis
                        </Button>
                    </Link>
                </div>
            </div>

            {reports.length === 0 ? (
                <EmptyState
                    icon={<FileStack size={24} />}
                    title="No reports yet"
                    description="Every completed analysis is saved here automatically so you can compare ideas over time."
                    actionLabel="Analyze an idea"
                    actionTo="/analyze"
                />
            ) : (
                <div className="space-y-3">
                    {reports.map((report) => (
                        <Card key={report.id} className="flex items-center gap-4 p-4 sm:p-5">
                            <CompactScore
                                score={report.result.risf.overall_score}
                                verdict={report.result.risf.verdict as Verdict}
                            />

                            <Link to={`/report/${report.id}`} className="min-w-0 flex-1">
                                <p className="truncate font-display text-sm font-semibold text-foreground hover:text-brand">
                                    {report.idea.title}
                                </p>
                                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                                    <span>{report.result.understanding.domain}</span>
                                    <span>·</span>
                                    <span>{timeAgo(report.createdAt)}</span>
                                    <span>·</span>
                                    <span>{report.result.papers.length} papers</span>
                                </p>
                            </Link>

                            <Badge tone="neutral" className="hidden sm:inline-flex">
                                {report.result.risf.verdict}
                            </Badge>

                            <button
                                onClick={() => deleteReport(report.id)}
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-rust/10 hover:text-rust"
                                aria-label="Delete report"
                            >
                                <Trash2 size={14} />
                            </button>

                            <Link to={`/report/${report.id}`} className="shrink-0 text-muted">
                                <ArrowRight size={15} />
                            </Link>
                        </Card>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}

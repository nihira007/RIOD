import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FlaskConical,
    FileText,
    Plus,
    ArrowRight,
    Sparkles,
} from "lucide-react";

import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, Eyebrow, Badge } from "@/components/common/Card";
import Button from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";
import CompactScore from "@/components/common/CompactScore";
import { useReportStore } from "@/lib/store";
import { fetchBackendHealth } from "@/lib/api";
import { timeAgo } from "@/lib/utils";
import type { Verdict } from "@/lib/types";

const quickActions = [
    { icon: FlaskConical, title: "Analyze an idea", description: "Run the eight-stage pipeline", to: "/analyze" },
    { icon: FileText, title: "Saved reports", description: "Revisit past analyses", to: "/reports" },
];

export default function Dashboard() {
    const { reports} = useReportStore();
    const [health, setHealth] = useState<"checking" | "online" | "offline">("checking");

    useEffect(() => {
        let cancelled = false;
        fetchBackendHealth()
            .then(() => !cancelled && setHealth("online"))
            .catch(() => !cancelled && setHealth("offline"));
        return () => {
            cancelled = true;
        };
    }, []);


    return (
        <DashboardLayout>
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <Eyebrow className="mb-2">Dashboard</Eyebrow>
                    <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
                        Welcome back
                    </h1>
                </div>
                <Link to="/analyze">
                    <Button>
                        <Plus size={15} /> New analysis
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Recent analyses */}
                <div className="lg:col-span-2">
                    <div className="mb-4 flex items-center justify-between">
                        <Eyebrow>Recent analyses</Eyebrow>
                        {reports.length > 0 && (
                            <Link to="/reports" className="text-xs font-medium text-brand hover:underline">
                                View all
                            </Link>
                        )}
                    </div>

                    {reports.length === 0 ? (
                        <EmptyState
                            icon={<Sparkles size={24} />}
                            title="No analyses yet"
                            description="Run your first research idea through the pipeline to see it summarized here."
                            actionLabel="Analyze an idea"
                            actionTo="/analyze"
                        />
                    ) : (
                        <div className="space-y-3">
                            {reports.slice(0, 5).map((report) => (
                                <Link key={report.id} to={`/report/${report.id}`}>
                                    <Card className="flex items-center gap-4 p-4 transition-colors hover:border-brand/40">
                                        <CompactScore
                                            score={report.result.risf.overall_score}
                                            verdict={report.result.risf.verdict as Verdict}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-display text-sm font-semibold text-foreground">
                                                {report.idea.title}
                                            </p>
                                            <p className="mt-0.5 truncate text-xs text-muted">
                                                {report.result.understanding.domain} · {timeAgo(report.createdAt)}
                                            </p>
                                        </div>
                                        <Badge tone="neutral">{report.result.papers.length} papers</Badge>
                                        <ArrowRight size={15} className="shrink-0 text-muted" />
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Quick actions */}
                    <div className="mt-8">
                        <Eyebrow className="mb-4">Quick actions</Eyebrow>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            {quickActions.map((action) => {
                                const Icon = action.icon;
                                return (
                                    <Link key={action.to} to={action.to}>
                                        <Card className="p-4 transition-colors hover:border-brand/40">
                                            <Icon size={17} className="text-brand" />
                                            <p className="mt-2.5 text-sm font-semibold text-foreground">
                                                {action.title}
                                            </p>
                                            <p className="mt-0.5 text-xs text-muted">{action.description}</p>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>

                
            </div>
        </DashboardLayout>
    );
}

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Card, Eyebrow } from "@/components/common/Card";
import EvidenceList from "@/components/common/EvidenceList";
import type { RISFMetric } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
    id: string;
    icon: LucideIcon;
    metric: RISFMetric;
    tone: "brand" | "teal" | "violet" | "rust";
    chart?: ReactNode;
    extra?: ReactNode;
}

const toneText: Record<Props["tone"], string> = {
    brand: "text-brand",
    teal: "text-teal",
    violet: "text-violet",
    rust: "text-rust",
};
const toneBg: Record<Props["tone"], string> = {
    brand: "bg-brand/12",
    teal: "bg-teal/12",
    violet: "bg-violet/12",
    rust: "bg-rust/12",
};

export default function MetricSection({ id, icon: Icon, metric, tone, chart, extra }: Props) {
    return (
        <section id={id} className="scroll-mt-24">
            <Card className="overflow-hidden p-0">
                <div className="flex flex-col gap-6 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                        <span className={cn("mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", toneBg[tone])}>
                            <Icon size={19} className={toneText[tone]} />
                        </span>
                        <div>
                            <Eyebrow className="mb-1">{metric.name}</Eyebrow>
                            <p className="text-sm leading-relaxed text-muted sm:max-w-lg">{metric.reasoning}</p>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-6 sm:pl-4">
                        <div className="text-right">
                            <p className={cn("font-mono text-3xl font-semibold tabular", toneText[tone])}>
                                {metric.score.toFixed(1)}
                            </p>
                            <p className="text-[11px] text-muted">score / 100</p>
                        </div>
                        <div className="text-right">
                            <p className="font-mono text-3xl font-semibold tabular text-foreground">
                                {Math.round(metric.confidence * 100)}%
                            </p>
                            <p className="text-[11px] text-muted">confidence</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 p-6 lg:grid-cols-2">
                    <div>
                        {chart}
                        {extra}
                    </div>
                    <div>
                        <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-wide text-muted">
                            Evidence ledger
                        </p>
                        <EvidenceList evidence={metric.evidence} limit={6} />
                    </div>
                </div>
            </Card>
        </section>
    );
}

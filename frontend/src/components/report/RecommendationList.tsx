import { ArrowUpRight } from "lucide-react";
import { Card, Badge } from "@/components/common/Card";
import type { Priority, Recommendation } from "@/lib/types";

const priorityTone: Record<Priority, "rust" | "brand" | "neutral"> = {
    High: "rust",
    Medium: "brand",
    Low: "neutral",
};

export default function RecommendationList({ recommendations }: { recommendations: Recommendation[] }) {
    if (recommendations.length === 0) {
        return (
            <p className="text-sm text-muted">
                No corrective recommendations were generated — the idea cleared every engine's threshold.
            </p>
        );
    }

    return (
        <div className="space-y-3">
            {recommendations.map((rec, i) => (
                <Card key={i} className="flex items-start gap-4 p-5">
                    <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface text-muted">
                        <ArrowUpRight size={15} />
                    </span>
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="font-display text-sm font-semibold text-foreground">{rec.title}</p>
                            <Badge tone={priorityTone[rec.priority]}>{rec.priority} priority</Badge>
                            <Badge tone="neutral">{rec.category}</Badge>
                        </div>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted">{rec.description}</p>
                        <p className="mt-1.5 text-xs italic text-muted/80">Based on: {rec.based_on}</p>
                    </div>
                </Card>
            ))}
        </div>
    );
}

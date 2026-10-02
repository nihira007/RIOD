import { cn } from "@/lib/utils";

interface Props {
    label: string;
    score: number;
    confidence?: number;
    tone?: "brand" | "teal" | "violet" | "rust";
    className?: string;
}

const toneClass: Record<NonNullable<Props["tone"]>, string> = {
    brand: "bg-brand",
    teal: "bg-teal",
    violet: "bg-violet",
    rust: "bg-rust",
};

export default function MetricBar({ label, score, confidence, tone = "brand", className }: Props) {
    const pct = Math.max(0, Math.min(score, 100));

    return (
        <div className={cn("w-full", className)}>
            <div className="mb-1.5 flex items-baseline justify-between">
                <span className="text-sm font-medium text-foreground">{label}</span>
                <span className="font-mono text-sm tabular text-muted">{pct.toFixed(1)}</span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-surface">
                <div
                    className={cn("h-full rounded-full transition-all duration-700 ease-out", toneClass[tone])}
                    style={{ width: `${pct}%` }}
                />
                {confidence !== undefined && (
                    <div
                        className="absolute top-0 h-full w-0.5 bg-foreground/40"
                        style={{ left: `${Math.max(0, Math.min(confidence, 1)) * 100}%` }}
                        title={`${Math.round(confidence * 100)}% confidence`}
                    />
                )}
            </div>
        </div>
    );
}

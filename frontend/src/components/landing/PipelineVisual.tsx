import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const STAGES = [
    { label: "Idea Understanding", detail: "Domain, problem, methodology parsed" },
    { label: "Literature Retrieval", detail: "arXiv + OpenAlex, deduplicated" },
    { label: "Novelty Analysis", detail: "5-dimension novelty engine" },
    { label: "Saturation Analysis", detail: "Density, citations, competition" },
    { label: "Trend Analysis", detail: "Keyword & topic forecasting" },
    { label: "Gap Discovery", detail: "Limitations, contradictions, futures" },
    { label: "RISF Evaluation", detail: "Weighted composite verdict" },
    { label: "Recommendations", detail: "Ranked, evidence-based" },
];

export default function PipelineVisual({ className }: { className?: string }) {
    const [active, setActive] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setActive((v) => (v + 1) % STAGES.length);
        }, 1400);
        return () => clearInterval(id);
    }, []);

    return (
        <div className={cn("relative rounded-2xl border border-border bg-surface-elevated p-5", className)}>
            <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                    Pipeline · live
                </span>
                <span className="flex h-2 w-2 rounded-full bg-teal">
                    <span className="h-full w-full animate-pulse-ring rounded-full bg-teal" />
                </span>
            </div>

            <ol className="relative space-y-0">
                {STAGES.map((stage, i) => {
                    const state = i < active ? "done" : i === active ? "active" : "pending";
                    return (
                        <li key={stage.label} className="relative flex gap-3.5 pb-4 last:pb-0">
                            {i < STAGES.length - 1 && (
                                <span
                                    className="absolute left-[9px] top-5 h-full w-px"
                                    style={{
                                        background:
                                            state === "done"
                                                ? "hsl(var(--brand))"
                                                : "hsl(var(--border))",
                                    }}
                                />
                            )}

                            <span
                                className={cn(
                                    "relative z-10 mt-0.5 flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full border font-mono text-[9px] transition-colors duration-500",
                                    state === "done" &&
                                        "border-brand bg-brand text-brand-foreground",
                                    state === "active" &&
                                        "border-brand bg-surface-elevated text-brand",
                                    state === "pending" && "border-border bg-surface text-muted"
                                )}
                            >
                                {state === "done" ? "✓" : i + 1}
                            </span>

                            <div className="min-w-0 pt-0">
                                <p
                                    className={cn(
                                        "text-sm font-semibold transition-colors duration-500",
                                        state === "pending" ? "text-muted" : "text-foreground"
                                    )}
                                >
                                    {stage.label}
                                </p>
                                {state === "active" && (
                                    <motion.p
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="mt-0.5 text-xs text-muted"
                                    >
                                        {stage.detail}
                                    </motion.p>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}

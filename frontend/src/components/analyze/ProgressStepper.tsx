import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STAGES = [
    "Idea Understanding",
    "Literature Retrieval",
    "Novelty Analysis",
    "Saturation Analysis",
    "Research Trend Analysis",
    "Research Gap Discovery",
    "RISF Evaluation",
    "Recommendation Engine",
];

/**
 * The backend runs the whole pipeline behind a single request/response --
 * there is no server-sent progress. This advances through the known stage
 * list on a timer while the request is in flight, and only ever reports
 * "done" once the response has actually returned (via `complete`).
 * The bar therefore never claims completion the backend hasn't confirmed.
 */
export default function ProgressStepper({ complete }: { complete: boolean }) {
    const [active, setActive] = useState(0);

    useEffect(() => {
        if (complete) return;
        const id = setInterval(() => {
            setActive((v) => Math.min(v + 1, STAGES.length - 1));
        }, 1900);
        return () => clearInterval(id);
    }, [complete]);

    const displayIndex = complete ? STAGES.length : active;

    return (
        <div>
            <ol className="space-y-3">
                {STAGES.map((stage, i) => {
                    const state = i < displayIndex ? "done" : i === displayIndex ? "active" : "pending";
                    return (
                        <li key={stage} className="flex items-center gap-3">
                            <span
                                className={cn(
                                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] transition-colors duration-300",
                                    state === "done" && "border-teal bg-teal text-white",
                                    state === "active" && "border-brand bg-brand/10 text-brand",
                                    state === "pending" && "border-border text-muted"
                                )}
                            >
                                {state === "done" ? (
                                    <Check size={12} />
                                ) : state === "active" ? (
                                    <Loader2 size={12} className="animate-spin" />
                                ) : (
                                    i + 1
                                )}
                            </span>
                            <span
                                className={cn(
                                    "text-sm transition-colors duration-300",
                                    state === "pending" ? "text-muted" : "font-medium text-foreground"
                                )}
                            >
                                {stage}
                            </span>
                        </li>
                    );
                })}
            </ol>

            <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-surface">
                <motion.div
                    className="h-full rounded-full bg-brand"
                    animate={{ width: `${(displayIndex / STAGES.length) * 100}%` }}
                    transition={{ ease: "easeOut", duration: 0.5 }}
                />
            </div>

            <AnimatePresence>
                {!complete && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mt-3 text-xs text-muted"
                    >
                        Literature retrieval and LLM calls can take a minute or two depending on the backend's
                        configured providers.
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}

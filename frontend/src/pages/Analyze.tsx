import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FlaskConical, AlertTriangle, Sparkles } from "lucide-react";

import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, Eyebrow, Badge } from "@/components/common/Card";
import Button from "@/components/common/Button";
import ProgressStepper from "@/components/analyze/ProgressStepper";
import { analyzeResearch, ApiError } from "@/lib/api";
import { useReportStore } from "@/lib/store";

const MIN_DESCRIPTION = 40;
const EXAMPLES = [
    {
        title: "Federated Fine-tuning for Low-Resource Clinical NLP",
        description:
            "A federated learning framework that fine-tunes a shared language model across multiple hospitals' clinical notes without centralizing patient data, using adapter layers to keep per-site communication cost low while preserving diagnostic prediction accuracy on rare conditions.",
    },
    {
        title: "Graph-Based Early Detection of Alzheimer's from MRI",
        description:
            "A graph neural network that models structural connectivity between brain regions extracted from MRI scans to predict early-stage Alzheimer's progression, benchmarked against ADNI with an emphasis on explainable region-level attention.",
    },
];

export default function Analyze() {
    const navigate = useNavigate();
    const { addReport } = useReportStore();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<"idle" | "running" | "error">("idle");
    const [complete, setComplete] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);

    const canSubmit = title.trim().length >= 4 && description.trim().length >= MIN_DESCRIPTION;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!canSubmit || status === "running") return;

        setStatus("running");
        setComplete(false);
        setError(null);

        try {
            const idea = { title: title.trim(), description: description.trim() };
            const result = await analyzeResearch(idea);
            setComplete(true);
            const saved = addReport(idea, result);
            setTimeout(() => navigate(`/report/${saved.id}`), 500);
        } catch (err) {
            setStatus("error");
            setError(err instanceof ApiError ? err : new ApiError("Something went wrong."));
        }
    }

    function fillExample(ex: (typeof EXAMPLES)[number]) {
        setTitle(ex.title);
        setDescription(ex.description);
    }

    const running = status === "running";

    return (
        <DashboardLayout>
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <Eyebrow className="mb-2">Analyze</Eyebrow>
                    <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
                        Describe your research idea
                    </h1>
                    <p className="mt-1.5 max-w-lg text-sm text-muted">
                        Two fields go to the pipeline: a title and a description. Be as specific as you
                        can about the problem, methodology and application area — the idea-understanding
                        stage uses this text directly.
                    </p>
                </div>
                <FlaskConical className="hidden text-brand/50 sm:block" size={40} />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
                <Card className="p-6 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="text-sm font-semibold text-foreground">
                                Research title
                            </label>
                            <input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={running}
                                placeholder="e.g. Graph-Based Early Detection of Alzheimer's from MRI"
                                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-brand disabled:opacity-60"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="description" className="text-sm font-semibold text-foreground">
                                    Research description
                                </label>
                                <span
                                    className={`font-mono text-xs tabular ${
                                        description.trim().length >= MIN_DESCRIPTION ? "text-teal" : "text-muted"
                                    }`}
                                >
                                    {description.trim().length}/{MIN_DESCRIPTION}+
                                </span>
                            </div>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={running}
                                rows={8}
                                placeholder="Describe the problem, proposed methodology, target application area, and expected contribution..."
                                className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted/60 focus:border-brand disabled:opacity-60"
                            />
                        </div>

                        

                        {error && (
                            <div className="flex items-start gap-2.5 rounded-xl border border-rust/30 bg-rust/10 p-4">
                                <AlertTriangle size={16} className="mt-0.5 shrink-0 text-rust" />
                                <div className="text-sm text-foreground">
                                    <p className="font-medium">{error.message}</p>
                                    {error.detail.length > 0 && (
                                        <ul className="mt-1 list-disc pl-4 text-xs text-muted">
                                            {error.detail.map((d, i) => (
                                                <li key={i}>{d}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        )}

                        <Button type="submit" size="lg" disabled={!canSubmit || running} className="w-full">
                            {running ? "Running pipeline…" : "Run the pipeline"}
                        </Button>

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                            <span className="text-xs text-muted">Try an example:</span>
                            {EXAMPLES.map((ex) => (
                                <button
                                    key={ex.title}
                                    type="button"
                                    disabled={running}
                                    onClick={() => fillExample(ex)}
                                    className="rounded-full border border-border px-3 py-1 text-xs text-muted transition-colors hover:border-brand/50 hover:text-foreground disabled:opacity-50"
                                >
                                    {ex.title.length > 34 ? `${ex.title.slice(0, 32)}…` : ex.title}
                                </button>
                            ))}
                        </div>
                    </form>
                </Card>

                <div className="space-y-6">
                    <Card className="p-6">
                        <div className="mb-5 flex items-center justify-between">
                            <p className="font-display text-sm font-semibold text-foreground">Pipeline status</p>
                            {running && <Badge tone="brand">Running</Badge>}
                            {status === "idle" && <Badge tone="neutral">Idle</Badge>}
                            {status === "error" && <Badge tone="rust">Failed</Badge>}
                        </div>

                        {status === "idle" ? (
                            <div className="flex flex-col items-center gap-3 py-8 text-center">
                                <Sparkles className="text-muted" size={22} />
                                <p className="text-sm text-muted">
                                    Submit the form to watch the eight-stage pipeline run in real time.
                                </p>
                            </div>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <ProgressStepper complete={complete} />
                            </motion.div>
                        )}
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}

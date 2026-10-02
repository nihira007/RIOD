import { ExternalLink } from "lucide-react";
import type { Evidence } from "@/lib/types";
import { Card } from "./Card";

export default function EvidenceList({ evidence, limit }: { evidence: Evidence[]; limit?: number }) {
    const items = limit ? evidence.slice(0, limit) : evidence;

    if (items.length === 0) {
        return <p className="text-sm text-muted">No supporting evidence was recorded for this metric.</p>;
    }

    return (
        <ol className="space-y-2.5">
            {items.map((item, i) => (
                <li key={`${item.title}-${i}`}>
                    <Card className="flex items-start gap-3 border-border/70 !shadow-none p-3.5">
                        <span className="mt-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-surface font-mono text-[11px] font-semibold text-muted">
                            {i + 1}
                        </span>

                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                                <span className="rounded-full border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-muted">
                                    {item.source}
                                </span>
                            </div>

                            <p className="mt-1 text-sm leading-relaxed text-muted">{item.description}</p>

                            {item.paper_title && (
                                <p className="mt-1 truncate text-xs italic text-muted/80">from &ldquo;{item.paper_title}&rdquo;</p>
                            )}

                            {item.url && (
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline"
                                >
                                    Source <ExternalLink size={11} />
                                </a>
                            )}
                        </div>

                        <div className="flex flex-col items-end gap-1">
                            <span className="font-mono text-xs tabular text-muted">
                                {Math.round(item.confidence * 100)}%
                            </span>
                            <div className="h-1 w-10 overflow-hidden rounded-full bg-surface">
                                <div
                                    className="h-full rounded-full bg-brand"
                                    style={{ width: `${Math.round(item.confidence * 100)}%` }}
                                />
                            </div>
                        </div>
                    </Card>
                </li>
            ))}
        </ol>
    );
}

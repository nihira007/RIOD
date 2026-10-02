import { Link } from "react-router-dom";
import { ExternalLink, Quote, CalendarDays } from "lucide-react";
import { Card, Badge } from "./Card";
import type { Paper } from "@/lib/types";

export default function PaperCard({
    paper,
    id,
    compact = false,
}: {
    paper: Paper;
    id?: string;
    compact?: boolean;
}) {
    const body = (
        <Card className="group flex h-full flex-col p-5 transition-colors hover:border-brand/40">
            <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-sm font-semibold leading-snug text-foreground line-clamp-2">
                    {paper.title}
                </h3>
                {typeof paper.similarity_score === "number" && (
                    <span className="shrink-0 rounded-full bg-brand/12 px-2 py-0.5 font-mono text-[10px] font-semibold text-brand">
                        {Math.round(paper.similarity_score * 100)}%
                    </span>
                )}
            </div>

            <p className="mt-1.5 truncate text-xs text-muted">
                {paper.authors.slice(0, 3).join(", ")}
                {paper.authors.length > 3 && ` +${paper.authors.length - 3}`}
            </p>

            {!compact && <p className="mt-2.5 text-xs leading-relaxed text-muted line-clamp-3">{paper.abstract}</p>}

            <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-3.5 text-xs text-muted">
                {paper.year && (
                    <span className="inline-flex items-center gap-1">
                        <CalendarDays size={11} /> {paper.year}
                    </span>
                )}
                {typeof paper.citations === "number" && (
                    <span className="inline-flex items-center gap-1">
                        <Quote size={11} /> {paper.citations}
                    </span>
                )}
                <Badge tone="neutral" className="py-0">
                    {paper.source}
                </Badge>
                {paper.venue && <span className="truncate italic">{paper.venue}</span>}
            </div>

            {paper.url && !id && (
                <a
                    href={paper.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline"
                >
                    Open source <ExternalLink size={11} />
                </a>
            )}
        </Card>
    );

    if (id) {
        return (
            <Link to={`/paper/${encodeURIComponent(id)}`} className="block h-full">
                {body}
            </Link>
        );
    }

    return body;
}

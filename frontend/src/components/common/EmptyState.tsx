import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import { Card } from "./Card";

export function EmptyState({
    icon,
    title,
    description,
    actionLabel,
    actionTo,
}: {
    icon?: ReactNode;
    title: string;
    description: string;
    actionLabel?: string;
    actionTo?: string;
}) {
    return (
        <Card className="flex flex-col items-center gap-4 border-dashed px-8 py-16 text-center">
            {icon && <div className="text-muted">{icon}</div>}
            <div>
                <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
                <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted">{description}</p>
            </div>
            {actionLabel && actionTo && (
                <Link to={actionTo}>
                    <Button size="sm">{actionLabel}</Button>
                </Link>
            )}
        </Card>
    );
}

export function StatCard({
    label,
    value,
    hint,
    icon,
}: {
    label: string;
    value: string;
    hint?: string;
    icon?: ReactNode;
}) {
    return (
        <Card className="p-5">
            <div className="flex items-start justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-muted">{label}</span>
                {icon && <span className="text-brand">{icon}</span>}
            </div>
            <p className="mt-3 font-mono text-2xl font-semibold tabular text-foreground">{value}</p>
            {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
        </Card>
    );
}

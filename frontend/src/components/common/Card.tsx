import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "rounded-2xl border border-border bg-surface-elevated shadow-card transition-shadow duration-300",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("p-6 pb-4", className)} {...props}>
            {children}
        </div>
    );
}

export function CardBody({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("p-6 pt-0", className)} {...props}>
            {children}
        </div>
    );
}

type BadgeTone = "neutral" | "brand" | "teal" | "violet" | "rust";

const badgeTones: Record<BadgeTone, string> = {
    neutral: "bg-surface text-muted border-border",
    brand: "bg-brand/12 text-brand border-brand/30",
    teal: "bg-teal/12 text-teal border-teal/30",
    violet: "bg-violet/12 text-violet border-violet/30",
    rust: "bg-rust/12 text-rust border-rust/30",
};

export function Badge({
    tone = "neutral",
    className,
    children,
}: {
    tone?: BadgeTone;
    className?: string;
    children: ReactNode;
}) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide",
                badgeTones[tone],
                className
            )}
        >
            {children}
        </span>
    );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <p
            className={cn(
                "font-mono text-xs font-medium uppercase tracking-[0.18em] text-brand",
                className
            )}
        >
            {children}
        </p>
    );
}

export function Divider({ className }: { className?: string }) {
    return <div className={cn("hairline", className)} />;
}

export function Container({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("mx-auto w-full max-w-7xl px-6 lg:px-10", className)} {...props}>
            {children}
        </div>
    );
}

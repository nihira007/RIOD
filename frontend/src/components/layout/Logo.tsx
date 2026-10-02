import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Logo({ className, to = "/" }: { className?: string; to?: string }) {
    return (
        <Link to={to} className={cn("group inline-flex items-center gap-2.5", className)}>
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" className="shrink-0">
                <circle cx="13" cy="13" r="12" className="stroke-brand" strokeWidth="1.4" />
                <circle cx="13" cy="13" r="7.5" className="fill-brand/15" />
                <path
                    d="M13 6.5 L13 19.5 M6.5 13 L19.5 13"
                    className="stroke-brand"
                    strokeWidth="1.1"
                    strokeDasharray="1.5 2.2"
                />
                <circle cx="13" cy="13" r="2.4" className="fill-brand" />
            </svg>
            <span className="font-display text-lg font-semibold leading-none tracking-tight text-foreground">
                RIOD
            </span>
        </Link>
    );
}

import { cn } from "@/lib/utils";
import type { Verdict } from "@/lib/types";

const tone: Record<
    Verdict,
    {
        border: string;
        bg: string;
        text: string;
    }
> = {
    Excellent: {
        border: "border-teal",
        bg: "bg-teal/5",
        text: "text-teal",
    },
    Strong: {
        border: "border-teal",
        bg: "bg-teal/5",
        text: "text-teal",
    },
    Moderate: {
        border: "border-brand",
        bg: "bg-brand/5",
        text: "text-brand",
    },
    Weak: {
        border: "border-rust",
        bg: "bg-rust/5",
        text: "text-rust",
    },
    Poor: {
        border: "border-rust",
        bg: "bg-rust/5",
        text: "text-rust",
    },
};

interface Props {
    score: number;
    verdict: Verdict;
}

export default function CompactScore({
    score,
    verdict,
}: Props) {
    const style = tone[verdict];

    return (
        <div className="flex flex-col items-center">
            <div
                className={cn(
                    "flex h-16 w-16 items-center justify-center rounded-full border-[3px]",
                    style.border,
                    style.bg
                )}
            >
                <span className="font-mono text-xl font-bold tabular-nums text-foreground">
                    {score.toFixed(1)}
                </span>
            </div>

            <span
                className={cn(
                    "mt-2 text-[11px] font-semibold uppercase tracking-wide",
                    style.text
                )}
            >
                {verdict}
            </span>
        </div>
    );
}
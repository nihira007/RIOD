import { cn } from "@/lib/utils";
import type { Verdict } from "@/lib/types";

const verdictTone: Record<Verdict, { ring: string; text: string; label: string }> = {
    Excellent: { ring: "stroke-teal", text: "text-teal", label: "Excellent" },
    Strong: { ring: "stroke-teal", text: "text-teal", label: "Strong" },
    Moderate: { ring: "stroke-brand", text: "text-brand", label: "Moderate" },
    Weak: { ring: "stroke-rust", text: "text-rust", label: "Weak" },
    Poor: { ring: "stroke-rust", text: "text-rust", label: "Poor" },
};

interface Props {
    score: number;
    verdict: Verdict;
    confidence?: number;
    size?: number;
    variant?: "default" | "compact";
    className?: string;
}


/**
 * The platform's signature visual: the RISF verdict rendered as a wax-seal /
 * instrument gauge rather than a generic progress ring -- notched outer edge
 * (like an official stamp), an inner arc reading the score, and the verdict
 * set in the display serif to echo a certification mark.
 */

    export default function ScoreSeal({
        score,
        verdict,
        confidence,
        size = 220,
        className,
    }: Props) {
    const tone = verdictTone[verdict];
    const radius = 84;
    const circumference = 2 * Math.PI * radius;
    const pct = Math.max(0, Math.min(score, 100)) / 100;
    const dash = circumference * pct;
    const notches = 28;

    return (
        <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
            <svg viewBox="0 0 220 220" className="h-full w-full -rotate-90">
                {/* notched outer edge, like a wax seal */}
                <g className="rotate-90" style={{ transformOrigin: "110px 110px" }}>
                    {Array.from({ length: notches }).map((_, i) => {
                        const angle = (i / notches) * 2 * Math.PI;
                        const x1 = 110 + Math.cos(angle) * 106;
                        const y1 = 110 + Math.sin(angle) * 106;
                        const x2 = 110 + Math.cos(angle) * 100;
                        const y2 = 110 + Math.sin(angle) * 100;
                        return (
                            <line
                                key={i}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                strokeWidth={2}
                                className="stroke-border"
                            />
                        );
                    })}
                </g>

                {/* track */}
                <circle
                    cx={110}
                    cy={110}
                    r={radius}
                    fill="none"
                    strokeWidth={10}
                    className="stroke-border"
                />

                {/* score arc */}
                <circle
                    cx={110}
                    cy={110}
                    r={radius}
                    fill="none"
                    strokeWidth={10}
                    strokeLinecap="round"
                    strokeDasharray={`${dash} ${circumference}`}
                    className={cn(tone.ring, "transition-[stroke-dasharray] duration-1000 ease-out")}
                />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono font-semibold tabular text-foreground">
                    {score.toFixed(1)}
                </span>
                <span className={cn("mt-1 font-display text-sm font-semibold uppercase tracking-[0.14em]", tone.text)}>
                    {tone.label}
                </span>
                {confidence !== undefined && (
                    <span className="mt-1 text-[11px] text-muted">
                        {Math.round(confidence * 100)}% confidence
                    </span>
                )}
            </div>
        </div>
    );
}

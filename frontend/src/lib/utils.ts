import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/** Clamp a number between two bounds. */
export function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

/** Format a 0-100 score as a fixed-precision string, e.g. "78.4". */
export function formatScore(score: number) {
    return score.toFixed(1);
}

/** Format a 0-1 confidence value as a percentage, e.g. "82%". */
export function formatConfidence(confidence: number) {
    return `${Math.round(confidence * 100)}%`;
}

/** Short relative time, e.g. "3h ago", "2d ago". */
export function timeAgo(iso: string) {
    const diffMs = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diffMs / 60000);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;

    return `${Math.floor(months / 12)}y ago`;
}

/** Deterministic short id, used for local report/paper keys. */
export function makeId() {
    return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function slugParam(value: string) {
    return encodeURIComponent(value);
}

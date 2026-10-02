import axios, { AxiosError } from "axios";
import type { APIResponse, ResearchIdea, ResearchPipelineResult } from "./types";

/**
 * Base URL for the RIOD backend. Configurable via VITE_API_BASE_URL so the
 * same build can point at a local FastAPI instance or a deployed one.
 * Falls back to the value the user can override on the Settings page,
 * which is persisted to localStorage.
 */
const DEFAULT_API_BASE_URL = "http://127.0.0.1:8000";
const STORAGE_KEY = "riod:api-base-url";

export function getApiBaseUrl(): string {
    if (typeof window === "undefined") return DEFAULT_API_BASE_URL;
    return (
        window.localStorage.getItem(STORAGE_KEY) ||
        (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
        DEFAULT_API_BASE_URL
    );
}

export function setApiBaseUrl(url: string) {
    window.localStorage.setItem(STORAGE_KEY, url);
}

const client = axios.create({
    timeout: 120_000,
});

export class ApiError extends Error {
    detail: string[];

    constructor(message: string, detail: string[] = []) {
        super(message);
        this.name = "ApiError";
        this.detail = detail;
    }
}

/**
 * POST /research/analyze
 * Runs the full 8-stage research intelligence pipeline. This can take a
 * while (literature retrieval + several LLM calls), so the caller should
 * show a long-running progress state rather than a spinner.
 */
export async function analyzeResearch(idea: ResearchIdea): Promise<ResearchPipelineResult> {
    try {
        const { data } = await client.post<APIResponse<ResearchPipelineResult>>(
            `${getApiBaseUrl()}/research/analyze`,
            idea
        );

        if (!data.success || !data.data) {
            throw new ApiError(data.message || "Research analysis failed.", data.errors);
        }

        return data.data;
    } catch (err) {
        if (err instanceof ApiError) throw err;

        const axiosErr = err as AxiosError<APIResponse<ResearchPipelineResult>>;

        if (axiosErr.response?.data) {
            const { message, errors } = axiosErr.response.data;
            throw new ApiError(message || "Research analysis failed.", errors || []);
        }

        if (axiosErr.code === "ECONNABORTED") {
            throw new ApiError(
                "The analysis is taking longer than expected and the request timed out. The backend may still be working -- try again shortly."
            );
        }

        throw new ApiError(
            `Could not reach the RIOD API at ${getApiBaseUrl()}. Confirm the backend is running and the URL is correct in Settings.`
        );
    }
}

/** GET / and /health -- used by Settings and Dashboard to show live backend status. */
export interface BackendHealth {
    status: string;
    version: string;
    services: Record<string, string>;
}

export async function fetchBackendHealth(): Promise<BackendHealth> {
    const { data } = await client.get<BackendHealth>(`${getApiBaseUrl()}/health`);
    return data;
}

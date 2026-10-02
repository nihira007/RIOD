import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import type { ReactNode } from "react";
import type { Paper, ResearchIdea, ResearchPipelineResult, SavedReport } from "./types";
import { makeId } from "./utils";


// ===========================================================================
// Report history (client-side persistence -- the backend has no database,
// every /research/analyze call is stateless, so saved reports live here)
// ===========================================================================

const REPORTS_KEY = "riod:reports";
const MAX_REPORTS = 40;

interface ReportStoreValue {
    reports: SavedReport[];
    addReport: (idea: ResearchIdea, result: ResearchPipelineResult) => SavedReport;
    getReport: (id: string) => SavedReport | undefined;
    deleteReport: (id: string) => void;
    clearReports: () => void;
    allPapers: StoredPaper[];
}

export interface StoredPaper extends Paper {
    id: string;
    reportId: string;
    reportTitle: string;
    analyzedAt: string;
}

const ReportStoreContext = createContext<ReportStoreValue | null>(null);

function loadReports(): SavedReport[] {
    try {
        const raw = window.localStorage.getItem(REPORTS_KEY);
        if (!raw) return [];
        return JSON.parse(raw) as SavedReport[];
    } catch {
        return [];
    }
}

function persistReports(reports: SavedReport[]) {
    try {
        window.localStorage.setItem(REPORTS_KEY, JSON.stringify(reports.slice(0, MAX_REPORTS)));
    } catch {
        // Storage full or unavailable -- fail silently, in-memory state still works.
    }
}

export function ReportStoreProvider({ children }: { children: ReactNode }) {
    const [reports, setReports] = useState<SavedReport[]>(() => loadReports());

    const addReport = useCallback((idea: ResearchIdea, result: ResearchPipelineResult) => {
        const record: SavedReport = {
            id: makeId(),
            createdAt: new Date().toISOString(),
            idea,
            result,
        };
        setReports((prev) => {
            const next = [record, ...prev].slice(0, MAX_REPORTS);
            persistReports(next);
            return next;
        });
        return record;
    }, []);

    const getReport = useCallback((id: string) => reports.find((r) => r.id === id), [reports]);

    const deleteReport = useCallback((id: string) => {
        setReports((prev) => {
            const next = prev.filter((r) => r.id !== id);
            persistReports(next);
            return next;
        });
    }, []);

    const clearReports = useCallback(() => {
        setReports([]);
        persistReports([]);
    }, []);

    const allPapers = useMemo<StoredPaper[]>(() => {
        const seen = new Map<string, StoredPaper>();
        for (const report of reports) {
            report.result.papers.forEach((paper, index) => {
                const key = paper.title.trim().toLowerCase();
                if (seen.has(key)) return;
                seen.set(key, {
                    ...paper,
                    id: `${report.id}::${index}`,
                    reportId: report.id,
                    reportTitle: report.idea.title,
                    analyzedAt: report.createdAt,
                });
            });
        }
        return Array.from(seen.values());
    }, [reports]);

    const value = useMemo(
        () => ({ reports, addReport, getReport, deleteReport, clearReports, allPapers }),
        [reports, addReport, getReport, deleteReport, clearReports, allPapers]
    );

    return <ReportStoreContext.Provider value={value}>{children}</ReportStoreContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- hook is intentionally co-located with its provider
export function useReportStore() {
    const ctx = useContext(ReportStoreContext);
    if (!ctx) throw new Error("useReportStore must be used within a ReportStoreProvider");
    return ctx;
}

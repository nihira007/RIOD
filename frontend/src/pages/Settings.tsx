import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Loader2, Trash2, Server, Info } from "lucide-react";

import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, Eyebrow, Badge } from "@/components/common/Card";
import Button from "@/components/common/Button";
import { getApiBaseUrl, setApiBaseUrl, fetchBackendHealth } from "@/lib/api";
import { useReportStore } from "@/lib/store";
import type { BackendHealth } from "@/lib/api";

export default function Settings() {
    const { reports, clearReports } = useReportStore();
    const [url, setUrl] = useState(getApiBaseUrl());
    const [checking, setChecking] = useState(false);
    const [health, setHealth] = useState<BackendHealth | null>(null);
    const [checkError, setCheckError] = useState<string | null>(null);
    const [confirmClear, setConfirmClear] = useState(false);

    async function checkConnection(target = url) {
        setChecking(true);
        setCheckError(null);
        setHealth(null);
        try {
            setApiBaseUrl(target);
            const result = await fetchBackendHealth();
            setHealth(result);
        } catch {
            setCheckError("Could not reach the backend at this URL.");
        } finally {
            setChecking(false);
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional fetch-on-mount status check
        checkConnection(url);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <DashboardLayout>
            <Eyebrow className="mb-2">Settings</Eyebrow>
            <h1 className="mb-8 font-display text-2xl font-semibold text-foreground sm:text-3xl">Settings</h1>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Backend connection */}
                <Card className="p-6">
                    <div className="mb-4 flex items-center gap-2.5">
                        <Server size={16} className="text-brand" />
                        <p className="font-display text-sm font-semibold text-foreground">Backend connection</p>
                    </div>

                    <label htmlFor="api-url" className="text-xs font-medium text-muted">
                        API base URL
                    </label>
                    <div className="mt-1.5 flex gap-2">
                        <input
                            id="api-url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="http://127.0.0.1:8000"
                            className="flex-1 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-brand"
                        />
                        <Button size="sm" variant="secondary" onClick={() => checkConnection(url)} disabled={checking}>
                            {checking ? <Loader2 size={14} className="animate-spin" /> : "Test"}
                        </Button>
                    </div>

                    <div className="mt-4 rounded-xl border border-border bg-surface p-4">
                        {checking ? (
                            <p className="flex items-center gap-2 text-sm text-muted">
                                <Loader2 size={14} className="animate-spin" /> Checking connection…
                            </p>
                        ) : health ? (
                            <div>
                                <p className="flex items-center gap-2 text-sm font-medium text-teal">
                                    <CheckCircle2 size={15} /> Connected — v{health.version}
                                </p>
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                    {Object.entries(health.services).map(([name, status]) => (
                                        <div
                                            key={name}
                                            className="flex items-center justify-between rounded-lg bg-background px-2.5 py-1.5 text-xs"
                                        >
                                            <span className="capitalize text-muted">{name}</span>
                                            <Badge tone={status === "available" ? "teal" : "rust"}>{status}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="flex items-center gap-2 text-sm font-medium text-rust">
                                <XCircle size={15} /> {checkError ?? "Not connected"}
                            </p>
                        )}
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-muted">
                        The FastAPI backend must be running separately (see the README) with CORS open to this
                        origin. This URL is stored in your browser only.
                    </p>
                </Card>


                {/* Data */}
                <Card className="p-6">
                    <div className="mb-4 flex items-center gap-2.5">
                        <Trash2 size={16} className="text-brand" />
                        <p className="font-display text-sm font-semibold text-foreground">Local data</p>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-4">
                        <div>
                            <p className="text-sm font-medium text-foreground">
                                {reports.length} saved {reports.length === 1 ? "report" : "reports"}
                            </p>
                            <p className="text-xs text-muted">
                                Reports and literature history are stored in this browser's local storage — the
                                backend keeps no database of its own.
                            </p>
                        </div>
                        {confirmClear ? (
                            <div className="flex shrink-0 gap-2">
                                <Button size="sm" variant="secondary" onClick={() => setConfirmClear(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    className="!bg-rust !text-white"
                                    onClick={() => {
                                        clearReports();
                                        setConfirmClear(false);
                                    }}
                                >
                                    Confirm
                                </Button>
                            </div>
                        ) : (
                            <Button
                                size="sm"
                                variant="secondary"
                                disabled={reports.length === 0}
                                onClick={() => setConfirmClear(true)}
                            >
                                Clear
                            </Button>
                        )}
                    </div>
                </Card>

                {/* Providers (informational) */}
                <Card className="p-6">
                    <div className="mb-4 flex items-center gap-2.5">
                        <Info size={16} className="text-brand" />
                        <p className="font-display text-sm font-semibold text-foreground">Configured providers</p>
                    </div>
                    <p className="mb-3 text-xs text-muted">
                        Set on the backend via environment variables — shown here for reference, not fetched live.
                    </p>
                    <ul className="space-y-2 text-sm text-muted">
                        <li className="flex justify-between border-b border-border pb-2">
                            <span>LLM reasoning</span>
                            <span className="text-foreground">Groq (primary) · Gemini (fallback)</span>
                        </li>
                        <li className="flex justify-between border-b border-border pb-2">
                            <span>Embeddings</span>
                            <span className="text-foreground">Sentence-Transformers MiniLM</span>
                        </li>
                        <li className="flex justify-between">
                            <span>Literature sources</span>
                            <span className="text-foreground">arXiv · OpenAlex</span>
                        </li>
                    </ul>
                </Card>
            </div>
        </DashboardLayout>
    );
}

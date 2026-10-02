import { ArrowRight, Layers, Server, Cpu, Database } from "lucide-react";
import { Card } from "@/components/common/Card";

const columns = [
    {
        icon: Layers,
        title: "Frontend",
        items: ["React + TypeScript", "Analyze / Report / Explorer", "Client-side report history"],
    },
    {
        icon: Server,
        title: "FastAPI",
        items: ["POST /research/analyze", "Pydantic request/response", "CORS-scoped API"],
    },
    {
        icon: Cpu,
        title: "Research Pipeline",
        items: ["Understanding · Retrieval", "Novelty · Saturation · Trend · Gap", "RISF · Recommend · Simulate"],
    },
    {
        icon: Database,
        title: "Providers",
        items: ["Groq / Gemini LLMs", "MiniLM embeddings", "arXiv + OpenAlex"],
    },
];

export default function ArchitectureDiagram() {
    return (
        <div className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-4">
            {columns.map((col, i) => {
                const Icon = col.icon;
                return (
                    <div key={col.title} className="flex items-stretch gap-3">
                        <Card className="flex-1 p-5">
                            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-brand/12 text-brand">
                                <Icon size={17} />
                            </div>
                            <p className="font-display text-sm font-semibold text-foreground">{col.title}</p>
                            <ul className="mt-2.5 space-y-1.5">
                                {col.items.map((item) => (
                                    <li key={item} className="text-xs leading-snug text-muted">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </Card>

                        {i < columns.length - 1 && (
                            <div className="hidden items-center justify-center sm:flex">
                                <ArrowRight size={16} className="text-border" />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

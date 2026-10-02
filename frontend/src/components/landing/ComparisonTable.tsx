import { Check, Minus } from "lucide-react";

const capabilities = [
    "Novelty validation",
    "Saturation analysis",
    "Trend forecasting",
    "Gap discovery",
    "Publishability signal",
    "Evidence traceability",
];

const systems = [
    { name: "RIOD", source: "This platform", support: [true, true, true, true, true, true], highlight: true },
    { name: "Shahid et al.", source: "Literature-grounded novelty assessment", support: [true, false, false, false, false, true] },
    { name: "ScholarEval", source: "Xu et al.", support: [true, false, false, false, false, true] },
    { name: "AI Co-Scientist", source: "Google Research", support: [false, false, false, true, false, false] },
    { name: "AIRA", source: "Literature retrieval agent", support: [false, false, false, false, false, false] },
    { name: "The AI Scientist", source: "Lu et al.", support: [true, false, false, false, false, false] },
];

export default function ComparisonTable() {
    return (
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface-elevated">
            <table className="w-full min-w-[720px] border-collapse text-sm">
                <thead>
                    <tr className="border-b border-border">
                        <th className="w-56 px-5 py-4 text-left font-mono text-[11px] font-medium uppercase tracking-wide text-muted">
                            System
                        </th>
                        {capabilities.map((cap) => (
                            <th
                                key={cap}
                                className="px-3 py-4 text-center text-xs font-semibold leading-tight text-foreground"
                            >
                                {cap}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {systems.map((system) => (
                        <tr
                            key={system.name}
                            className={
                                system.highlight
                                    ? "border-b border-border bg-brand/[0.05]"
                                    : "border-b border-border last:border-0"
                            }
                        >
                            <td className="px-5 py-4">
                                <p
                                    className={
                                        system.highlight
                                            ? "font-display text-sm font-semibold text-brand"
                                            : "text-sm font-semibold text-foreground"
                                    }
                                >
                                    {system.name}
                                </p>
                                <p className="text-xs text-muted">{system.source}</p>
                            </td>
                            {system.support.map((yes, i) => (
                                <td key={i} className="px-3 py-4 text-center">
                                    {yes ? (
                                        <Check
                                            size={16}
                                            className={system.highlight ? "mx-auto text-brand" : "mx-auto text-teal"}
                                        />
                                    ) : (
                                        <Minus size={16} className="mx-auto text-muted/40" />
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

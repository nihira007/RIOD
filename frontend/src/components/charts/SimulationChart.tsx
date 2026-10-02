import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from "recharts";
import type { SimulationResult } from "@/lib/types";

export default function SimulationChart({
    current,
    simulations,
}: {
    current: number;
    simulations: SimulationResult[];
}) {
    const data = simulations.map((s) => ({
        name: s.scenario.length > 22 ? `${s.scenario.slice(0, 20)}…` : s.scenario,
        predicted: s.predicted_score,
        improvement: s.improvement,
    }));

    return (
        <ResponsiveContainer width="100%" height={Math.max(220, data.length * 46)}>
            <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
                <CartesianGrid stroke="hsl(var(--border))" horizontal={false} />
                <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                />
                <YAxis
                    type="category"
                    dataKey="name"
                    width={150}
                    tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                />
                <Tooltip
                    contentStyle={{
                        background: "hsl(var(--surface-elevated))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 10,
                        fontSize: 12,
                    }}
                    formatter={(value, key) => [
                        Number(value).toFixed(1),
                        key === "predicted" ? "Predicted score" : String(key),
                    ]}
                />
                <ReferenceLine x={current} stroke="hsl(var(--muted-foreground))" strokeDasharray="4 3" />
                <Bar dataKey="predicted" radius={[0, 6, 6, 0]} maxBarSize={22}>
                    {data.map((_, i) => (
                        <Cell key={i} fill="hsl(var(--accent-teal))" />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}

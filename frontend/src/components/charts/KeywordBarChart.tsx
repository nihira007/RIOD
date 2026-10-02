import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export interface BarPoint {
    name: string;
    value: number;
}

export default function KeywordBarChart({
    data,
    color = "hsl(var(--accent-violet))",
    valueLabel = "Count",
}: {
    data: BarPoint[];
    color?: string;
    valueLabel?: string;
}) {
    return (
        <ResponsiveContainer width="100%" height={Math.max(180, data.length * 32)}>
            <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
                <CartesianGrid stroke="hsl(var(--border))" horizontal={false} />
                <XAxis
                    type="number"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                />
                <YAxis
                    type="category"
                    dataKey="name"
                    width={110}
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
                    formatter={(value) => [String(value), valueLabel]}
                />
                <Bar dataKey="value" fill={color} radius={[0, 6, 6, 0]} maxBarSize={16} />
            </BarChart>
        </ResponsiveContainer>
    );
}

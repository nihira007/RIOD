import {
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

export interface TimelinePoint {
    year: string;
    published?: number;
    forecast?: number;
}

export default function PublicationTimeline({ data }: { data: TimelinePoint[] }) {
    return (
        <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                    dataKey="year"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    tickLine={false}
                />
                <YAxis
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                />
                <Tooltip
                    contentStyle={{
                        background: "hsl(var(--surface-elevated))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 10,
                        fontSize: 12,
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="published" name="Published" fill="hsl(var(--brand))" radius={[4, 4, 0, 0]} maxBarSize={34} />
                <Line
                    type="monotone"
                    dataKey="forecast"
                    name="Forecast"
                    stroke="hsl(var(--accent-teal))"
                    strokeWidth={2}
                    strokeDasharray="5 4"
                    dot={{ r: 3 }}
                />
            </ComposedChart>
        </ResponsiveContainer>
    );
}

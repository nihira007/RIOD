import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

export interface RadarPoint {
    axis: string;
    value: number;
}

export default function RadarBreakdown({ data, color = "hsl(var(--brand))" }: { data: RadarPoint[]; color?: string }) {
    return (
        <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={data} outerRadius="72%">
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis
                    dataKey="axis"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11.5 }}
                />
                <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }}
                    axisLine={false}
                />
                <Radar
                    dataKey="value"
                    stroke={color}
                    fill={color}
                    fillOpacity={0.22}
                    strokeWidth={2}
                    animationDuration={700}
                />
                <Tooltip
                    contentStyle={{
                        background: "hsl(var(--surface-elevated))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 10,
                        fontSize: 12,
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
                    formatter={(value) => [Number(value).toFixed(1), "Score"]}
                />
            </RadarChart>
        </ResponsiveContainer>
    );
}

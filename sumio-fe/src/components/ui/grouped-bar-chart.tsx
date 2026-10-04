import { cn } from "@heroui/react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface BarSeries {
  /** Key of the numeric field in each data row. */
  key: string;
  name: string;
  /** Any CSS color, e.g. "var(--chart-1)". */
  color: string;
}

interface GroupedBarChartProps {
  data: object[];
  /** Key of the category field (x axis). */
  xKey: string;
  series: BarSeries[];
  max: number;
  /** Number of y-axis steps above 0. */
  steps?: number;
  formatValue?: (value: number) => string;
  className?: string;
}

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "var(--surface)",
  fontSize: 12,
};

export function GroupedBarChart({
  data,
  xKey,
  series,
  max,
  steps = 5,
  formatValue = String,
  className,
}: GroupedBarChartProps) {
  const ticks = Array.from({ length: steps + 1 }, (_, i) => (max / steps) * i);

  return (
    <div className={cn("h-48 w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -12 }} barGap={4}>
          <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="var(--border)" />
          <XAxis
            dataKey={xKey}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted)", fontSize: 11 }}
          />
          <YAxis
            domain={[0, max]}
            ticks={ticks}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatValue}
            tick={{ fill: "var(--muted)", fontSize: 10 }}
          />
          <Tooltip
            cursor={{ fill: "var(--surface-secondary)" }}
            formatter={(value) => formatValue(Number(value))}
            contentStyle={tooltipStyle}
          />
          {series.map((s) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.name}
              fill={s.color}
              radius={[6, 6, 0, 0]}
              maxBarSize={16}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

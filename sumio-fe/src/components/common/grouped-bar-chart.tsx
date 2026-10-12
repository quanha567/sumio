import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { cn } from "@/components/ui";

export interface BarSeries {
  /** Key of the numeric field in each data row. */
  key: string;
  name: string;
  /** Any CSS color, e.g. "var(--chart-1)". */
  color: string;
}

export interface GroupedBarChartProps {
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

interface CustomChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number;
    color?: string;
  }>;
  label?: string;
  formatValue?: (value: number) => string;
}

function CustomChartTooltip({ active, payload, label, formatValue }: CustomChartTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="border-border bg-surface/95 rounded-xl border px-3 py-2 shadow-md backdrop-blur-sm transition-all">
      {label && <p className="text-foreground mb-1.5 text-xs font-semibold">{label}</p>}
      <div className="flex flex-col gap-1.5">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-4 text-xs">
            <span className="text-muted flex items-center gap-1.5">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span>{entry.name}</span>
            </span>
            <span className="text-foreground font-semibold tabular-nums">
              {entry.value !== undefined
                ? formatValue
                  ? formatValue(Number(entry.value))
                  : entry.value
                : null}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

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
          <Tooltip cursor={false} content={<CustomChartTooltip formatValue={formatValue} />} />
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

export interface ChartLegendProps {
  series: BarSeries[];
  className?: string;
}

export function ChartLegend({ series, className }: ChartLegendProps) {
  return (
    <ul className={cn("hidden items-center gap-3 sm:flex", className)}>
      {series.map((s) => (
        <li key={s.key} className="flex items-center gap-1.5">
          <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
          <span className="text-muted text-xs">{s.name}</span>
        </li>
      ))}
    </ul>
  );
}

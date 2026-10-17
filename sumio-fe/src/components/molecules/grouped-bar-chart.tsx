import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { cn, ColorDot, Text } from "@/components/atoms";

export interface BarSeries {
  key: string;
  name: string;
  /** Any CSS color, e.g. "var(--chart-1)". */
  color: string;
}

export interface GroupedBarChartProps<T extends Record<string, unknown>> {
  data: T[];
  xKey: keyof T & string;
  series: BarSeries[];
  height?: number;
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

function formatTooltipValue(
  value: number | undefined,
  formatter?: (val: number) => string,
): string | number | null {
  if (value === undefined) return null;
  if (formatter) return formatter(Number(value));

  return value;
}

function CustomChartTooltip({ active, payload, label, formatValue }: CustomChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="border-border bg-surface/95 rounded-xl border px-3 py-2 shadow-md backdrop-blur-sm transition-all">
      {label && (
        <Text variant="label" className="mb-1.5">
          {label}
        </Text>
      )}

      <div className="flex flex-col gap-1.5">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <ColorDot color={entry.color} size="sm" />
              <Text variant="muted">{entry.name}</Text>
            </span>

            <Text variant="body-sm" weight="semibold" className="tabular-nums">
              {formatTooltipValue(entry.value, formatValue)}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GroupedBarChart<T extends Record<string, unknown>>({
  data,
  xKey,
  series,
  height = 240,
  formatValue,
  className,
}: GroupedBarChartProps<T>) {
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey={xKey as string}
            stroke="var(--muted-foreground)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="var(--muted-foreground)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatValue}
          />
          <Tooltip
            content={<CustomChartTooltip formatValue={formatValue} />}
            cursor={{ fill: "var(--surface-secondary)", opacity: 0.5 }}
          />
          {series.map((s) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.name}
              fill={s.color}
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
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
          <ColorDot color={s.color} size="sm" />
          <Text variant="muted">{s.name}</Text>
        </li>
      ))}
    </ul>
  );
}

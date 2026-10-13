import type { ReactNode } from "react";
import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { cn, ColorDot, Text } from "@/components/ui";
import { formatCurrency } from "@/lib/format";

export interface DonutSegment {
  label: string;
  value: number;
  /** Any CSS color, e.g. "var(--chart-1)". */
  color: string;
}

export interface DonutChartProps {
  segments: DonutSegment[];
  size?: number;
  /** Content rendered in the hole. */
  children?: ReactNode;
  className?: string;
}

interface CustomDonutTooltipProps {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number;
    payload?: DonutSegment;
  }>;
}

function CustomDonutTooltip({ active, payload }: CustomDonutTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0];

  return (
    <div className="border-border bg-surface/95 rounded-xl border px-3 py-2 shadow-md backdrop-blur-sm transition-all">
      <div className="flex items-center gap-2 text-xs">
        <ColorDot color={item.payload?.color} size="sm" />
        <Text variant="muted">{item.name}:</Text>
        <Text variant="body-sm" weight="semibold" className="tabular-nums">
          {item.value === undefined ? null : formatCurrency(item.value)}
        </Text>
      </div>
    </div>
  );
}

export function DonutChart({ segments, size = 160, children, className }: DonutChartProps) {
  return (
    <div
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={segments.map((s) => ({ ...s, fill: s.color }))}
            dataKey="value"
            nameKey="label"
            innerRadius="68%"
            outerRadius="100%"
            paddingAngle={2}
            startAngle={90}
            endAngle={-270}
            stroke="none"
          />
          <Tooltip content={<CustomDonutTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {children && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          {children}
        </div>
      )}
    </div>
  );
}

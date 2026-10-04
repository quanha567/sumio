import { cn } from "@heroui/react";
import type { ReactNode } from "react";
import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export interface DonutSegment {
  label: string;
  value: number;
  /** Any CSS color, e.g. "var(--chart-1)". */
  color: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  size?: number;
  /** Content rendered in the hole. */
  children?: ReactNode;
  className?: string;
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
          <Tooltip />
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

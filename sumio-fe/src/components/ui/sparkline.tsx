import { cn } from "@heroui/react";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";

interface SparklineProps {
  data: number[];
  /** Any CSS color, e.g. "var(--success)". */
  color?: string;
  className?: string;
}

/** Tiny smooth trend line with soft area fill. */
export function Sparkline({ data, color = "var(--accent)", className }: SparklineProps) {
  return (
    <div className={cn("h-7 w-20", className)} aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data.map((value, index) => ({ index, value }))}
          margin={{ top: 3, right: 2, bottom: 3, left: 2 }}
        >
          <YAxis hide domain={["dataMin", "dataMax"]} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={color}
            fillOpacity={0.12}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

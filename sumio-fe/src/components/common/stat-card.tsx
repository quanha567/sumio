import { Info, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Card, cn, Metric, Text, type Tone, toneStyles } from "@/components/ui";

import { IconBadge } from "./icon-badge";
import { Sparkline } from "./sparkline";
import { TrendBadge } from "./trend-badge";

export interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: Tone;
  delta?: string;
  deltaDirection?: "up" | "down" | "none";
  deltaTone?: Tone;
  deltaCaption?: string;
  trend?: number[];
  hint?: boolean;
  className?: string;
}

function StatCardRoot({
  label,
  value,
  icon,
  tone = "accent",
  delta,
  deltaDirection = "up",
  deltaTone = "success",
  deltaCaption = "vs. last month",
  trend,
  hint,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("flex flex-col gap-3", className)} padding="sm">
      <div className="flex items-center gap-3">
        <IconBadge icon={icon} tone={tone} className="size-10 shrink-0 sm:size-11" />
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <Text variant="muted" weight="medium" className="truncate">
              {label}
            </Text>
            {hint && (
              <Text variant="muted">
                <Info className="size-3 shrink-0" />
              </Text>
            )}
          </div>
          <Metric value={value} size="md" />
        </div>
      </div>
      <div className="flex items-end justify-between gap-2">
        {delta && (
          <TrendBadge
            delta={delta}
            direction={deltaDirection}
            tone={deltaTone}
            caption={deltaCaption}
          />
        )}
        {trend && trend.length > 0 && <Sparkline data={trend} color={toneStyles[tone].color} />}
      </div>
    </Card>
  );
}

export interface StatCardGridProps {
  children: ReactNode;
  className?: string;
}

/** Standard responsive 4-column KPI grid (1 col mobile, 2 cols tablet, 4 cols desktop). */
export function StatCardGrid({ children, className }: StatCardGridProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4", className)}>
      {children}
    </div>
  );
}

export const StatCard = Object.assign(StatCardRoot, {
  Grid: StatCardGrid,
});

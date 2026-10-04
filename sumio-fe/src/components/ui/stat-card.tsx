import { cn } from "@heroui/react";
import { ArrowUp, ArrowDown, Info, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Card } from "./card";
import { IconBadge } from "./icon-badge";
import { Sparkline } from "./sparkline";
import { type Tone, toneStyles } from "./tone";
import { Metric, Text } from "./typography";

export interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: Tone;
  /** e.g. "12%". Direction decides the arrow; `deltaTone` decides the color. */
  delta?: string;
  deltaDirection?: "up" | "down";
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
  const DeltaIcon = deltaDirection === "up" ? ArrowUp : ArrowDown;
  return (
    <Card className={cn("flex flex-col gap-3 p-3.5 sm:p-4", className)}>
      <div className="flex items-center gap-3">
        <IconBadge
          icon={icon}
          tone={tone}
          className="h-10 w-10 shrink-0 rounded-full sm:h-11 sm:w-11"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <Text variant="muted" className="truncate font-medium">
              {label}
            </Text>
            {hint && <Info className="text-muted h-3 w-3 shrink-0" />}
          </div>
          <Metric value={value} size="md" />
        </div>
      </div>
      <div className="flex items-end justify-between gap-2">
        {delta && (
          <div className="flex items-center gap-1">
            <span
              className={cn(
                "flex items-center text-[11px] font-semibold tabular-nums",
                toneStyles[deltaTone].text,
              )}
            >
              <DeltaIcon className="h-3 w-3" />
              {delta}
            </span>
            <Text variant="caption">{deltaCaption}</Text>
          </div>
        )}
        {trend && <Sparkline data={trend} color={toneStyles[tone].color} />}
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

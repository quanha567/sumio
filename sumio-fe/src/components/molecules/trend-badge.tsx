import { ArrowDown, ArrowUp } from "lucide-react";

import { cn, Text, toneStyles, type Tone } from "@/components/atoms";

export interface TrendBadgeProps {
  delta: string;
  direction?: "up" | "down" | "none";
  tone?: Tone;
  caption?: string;
  className?: string;
}

/**
 * Standard Sumio Trend Indicator:
 * Encapsulates tabular numbers, direction arrow, pulse indicator, and tone typography.
 */
export function TrendBadge({
  delta,
  direction = "up",
  tone = "success",
  caption,
  className,
}: TrendBadgeProps) {
  const style = toneStyles[tone];

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span
        className={cn(
          "flex items-center gap-0.5 text-[11px] font-semibold tabular-nums",
          style.text,
        )}
      >
        {direction === "up" && <ArrowUp className="size-3" />}
        {direction === "down" && <ArrowDown className="size-3" />}
        {direction === "none" && (
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-current" />
          </span>
        )}
        {delta}
      </span>

      {caption && (
        <Text variant="muted" size="xs">
          {caption}
        </Text>
      )}
    </div>
  );
}

import {
  ProgressBar,
  ProgressBarFill,
  ProgressBarOutput,
  ProgressBarRoot,
  ProgressBarTrack,
  ProgressCircle,
  ProgressCircleFillCircle,
  ProgressCircleRoot,
  ProgressCircleTrack,
  ProgressCircleTrackCircle,
  progressBarVariants,
  progressCircleVariants,
} from "@heroui/react";
import type { ReactNode } from "react";

import { cn } from "./cn";
import { mapProgressColor, type UnifiedColor } from "./tone";

export {
  ProgressBar,
  ProgressBarFill,
  ProgressBarOutput,
  ProgressBarRoot,
  ProgressBarTrack,
  ProgressCircle,
  ProgressCircleFillCircle,
  ProgressCircleRoot,
  ProgressCircleTrack,
  ProgressCircleTrackCircle,
  progressBarVariants,
  progressCircleVariants,
};

export type {
  ProgressBarProps,
  ProgressBarFillProps,
  ProgressBarOutputProps,
  ProgressBarRootProps,
  ProgressBarTrackProps,
  ProgressCircleProps,
  ProgressCircleFillCircleProps,
  ProgressCircleRootProps,
  ProgressCircleTrackProps,
  ProgressCircleTrackCircleProps,
  ProgressBarVariants,
  ProgressCircleVariants,
} from "@heroui/react";

export const Progress = {
  Bar: ProgressBar,
  Circle: ProgressCircle,
};

export interface ProgressLineProps {
  value: number;
  ariaLabel: string;
  trackClassName?: string;
  fillClassName?: string;
  className?: string;
  color?: UnifiedColor;
}

/** Ready-made HeroUI progress bar (track + fill). */
export function ProgressLine({
  value,
  ariaLabel,
  trackClassName,
  fillClassName,
  className,
  color,
}: ProgressLineProps) {
  return (
    <ProgressBar
      color={mapProgressColor(color)}
      aria-label={ariaLabel}
      value={value}
      className={className}
    >
      <ProgressBar.Track className={trackClassName}>
        <ProgressBar.Fill className={fillClassName} />
      </ProgressBar.Track>
    </ProgressBar>
  );
}

export interface ProgressRingProps {
  value: number;
  ariaLabel: string;
  className?: string;
  color?: UnifiedColor;
  children?: ReactNode;
}

/** Ready-made HeroUI progress circle with centered content. */
export function ProgressRing({ value, ariaLabel, className, color, children }: ProgressRingProps) {
  return (
    <div className={cn("relative inline-flex shrink-0 items-center justify-center", className)}>
      <ProgressCircle
        color={mapProgressColor(color)}
        aria-label={ariaLabel}
        value={value}
        size="lg"
      >
        <ProgressCircle.Track>
          <ProgressCircle.TrackCircle />
          <ProgressCircle.FillCircle />
        </ProgressCircle.Track>
      </ProgressCircle>
      {children && (
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
          {children}
        </span>
      )}
    </div>
  );
}

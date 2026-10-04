import {
  ProgressBar as HeroUIProgressBar,
  ProgressCircle as HeroUIProgressCircle,
  cn,
} from "@heroui/react";
import type { ComponentProps, ReactNode } from "react";

export interface ProgressBarProps extends Omit<
  ComponentProps<typeof HeroUIProgressBar>,
  "className"
> {
  className?: string;
}

export interface ProgressCircleProps extends Omit<
  ComponentProps<typeof HeroUIProgressCircle>,
  "className"
> {
  className?: string;
}

export function ProgressBar({ className, ...props }: ProgressBarProps) {
  return (
    <HeroUIProgressBar
      className={cn("w-full overflow-hidden rounded-full", className)}
      {...props}
    />
  );
}

export function ProgressCircle({ className, children, ...props }: ProgressCircleProps) {
  return (
    <HeroUIProgressCircle
      className={cn("inline-flex items-center justify-center", className)}
      {...props}
    >
      {children}
    </HeroUIProgressCircle>
  );
}

interface ProgressLineProps {
  value: number;
  ariaLabel: string;
  trackClassName?: string;
  fillClassName?: string;
  className?: string;
}

/** Ready-made HeroUI progress bar (track + fill). */
export function ProgressLine({
  value,
  ariaLabel,
  trackClassName,
  fillClassName,
  className,
}: ProgressLineProps) {
  return (
    <HeroUIProgressBar aria-label={ariaLabel} value={value} className={cn("w-full", className)}>
      <HeroUIProgressBar.Track className={trackClassName}>
        <HeroUIProgressBar.Fill className={fillClassName} />
      </HeroUIProgressBar.Track>
    </HeroUIProgressBar>
  );
}

interface ProgressRingProps {
  value: number;
  ariaLabel: string;
  className?: string;
  /** Rendered in the center of the ring. */
  children?: ReactNode;
}

/** Ready-made HeroUI progress circle with a centered label. */
export function ProgressRing({ value, ariaLabel, className, children }: ProgressRingProps) {
  return (
    <div className={cn("relative inline-flex shrink-0 items-center justify-center", className)}>
      <HeroUIProgressCircle aria-label={ariaLabel} value={value} size="lg">
        <HeroUIProgressCircle.Track>
          <HeroUIProgressCircle.TrackCircle />
          <HeroUIProgressCircle.FillCircle />
        </HeroUIProgressCircle.Track>
      </HeroUIProgressCircle>
      {children && (
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
          {children}
        </span>
      )}
    </div>
  );
}

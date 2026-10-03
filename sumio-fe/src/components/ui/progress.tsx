import {
  ProgressBar as HeroUIProgressBar,
  ProgressCircle as HeroUIProgressCircle,
  cn,
} from "@heroui/react";
import type { ComponentProps } from "react";

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

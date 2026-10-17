import {
  Spinner as HeroUISpinner,
  SpinnerRoot,
  type SpinnerProps as HeroUISpinnerProps,
} from "@heroui/react";
import { spinnerVariants, tv, type VariantProps } from "@heroui/styles";

import { cn } from "./cn";

export const customSpinnerVariants = tv({
  extend: spinnerVariants,
  base: "text-accent",
});

export type CustomSpinnerVariants = VariantProps<typeof customSpinnerVariants>;

export interface SpinnerProps extends HeroUISpinnerProps {
  className?: string;
}

function BaseSpinner({ className, ...props }: SpinnerProps) {
  return <HeroUISpinner className={cn(customSpinnerVariants(), className)} {...props} />;
}

export const Spinner = Object.assign(BaseSpinner, {
  Root: SpinnerRoot,
});

export { SpinnerRoot };
export { spinnerVariants };
export type SpinnerVariants = CustomSpinnerVariants;

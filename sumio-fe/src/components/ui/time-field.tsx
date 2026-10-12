import { TimeField as HeroUITimeField, TimeFieldRoot } from "@heroui/react";
import { timeFieldVariants, tv, type VariantProps } from "@heroui/styles";
import type { ComponentProps } from "react";

import { cn } from "./cn";

export const customTimeFieldVariants = tv({
  extend: timeFieldVariants,
  base: "rounded-md border border-border bg-field-background text-field-foreground focus-within:border-focus transition-all h-9 px-3 text-sm flex items-center",
});

export type CustomTimeFieldVariants = VariantProps<typeof customTimeFieldVariants>;

export interface TimeFieldProps extends ComponentProps<typeof HeroUITimeField> {
  className?: string;
}

function BaseTimeField({ className, ...props }: TimeFieldProps) {
  return <HeroUITimeField className={cn(customTimeFieldVariants(), className)} {...props} />;
}

export const TimeField = Object.assign(BaseTimeField, {
  Root: TimeFieldRoot,
});

export { TimeFieldRoot };
export type { TimeFieldRootProps } from "@heroui/react";
export { timeFieldVariants };
export type TimeFieldVariants = CustomTimeFieldVariants;

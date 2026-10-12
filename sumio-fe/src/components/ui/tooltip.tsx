import {
  Tooltip as HeroUITooltip,
  TooltipArrow,
  TooltipContent as HeroUITooltipContent,
  TooltipRoot,
  TooltipTrigger,
} from "@heroui/react";
import { tooltipVariants, tv, type VariantProps } from "@heroui/styles";
import type { ComponentProps } from "react";

import { cn } from "./cn";

export const customTooltipVariants = tv({
  extend: tooltipVariants,
  base: "bg-surface-foreground text-surface text-xs font-medium rounded-md px-2.5 py-1 shadow-sm select-none",
});

export type CustomTooltipVariants = VariantProps<typeof customTooltipVariants>;

function TooltipContentBase({ className, ...props }: ComponentProps<typeof HeroUITooltipContent>) {
  return <HeroUITooltipContent className={cn(customTooltipVariants(), className)} {...props} />;
}

export const Tooltip = Object.assign(HeroUITooltip, {
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Content: TooltipContentBase,
  Arrow: TooltipArrow,
});

export const TooltipContent = TooltipContentBase;

export { TooltipRoot, TooltipTrigger, TooltipArrow };

export type { TooltipProps } from "@heroui/react";
export { tooltipVariants };
export type TooltipVariants = CustomTooltipVariants;

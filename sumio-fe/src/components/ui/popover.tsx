import {
  Popover as HeroUIPopover,
  PopoverArrow,
  PopoverContent as HeroUIPopoverContent,
  PopoverDialog as HeroUIPopoverDialog,
  PopoverHeading,
  PopoverRoot,
  PopoverTrigger,
} from "@heroui/react";
import { popoverVariants, tv, type VariantProps } from "@heroui/styles";
import type { ComponentProps } from "react";

import { cn } from "./cn";

export const customPopoverVariants = tv({
  extend: popoverVariants,
  base: "bg-overlay text-overlay-foreground border border-border rounded-md shadow-md overflow-hidden",
});

export type CustomPopoverVariants = VariantProps<typeof customPopoverVariants>;

function PopoverContentBase({ className, ...props }: ComponentProps<typeof HeroUIPopoverContent>) {
  return (
    <HeroUIPopoverContent
      className={cn(customPopoverVariants(), "outline-none", className)}
      {...props}
    />
  );
}

function PopoverDialogBase({ className, ...props }: ComponentProps<typeof HeroUIPopoverDialog>) {
  return (
    <HeroUIPopoverDialog
      className={cn("p-3 outline-none text-sm text-foreground", className)}
      {...props}
    />
  );
}

export const Popover = Object.assign(HeroUIPopover, {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Content: PopoverContentBase,
  Dialog: PopoverDialogBase,
  Arrow: PopoverArrow,
  Heading: PopoverHeading,
});

export const PopoverContent = PopoverContentBase;
export const PopoverDialog = PopoverDialogBase;

export { PopoverRoot, PopoverTrigger, PopoverArrow, PopoverHeading };

export type {
  PopoverProps,
  PopoverContentProps,
  PopoverDialogProps,
  PopoverTriggerProps,
} from "@heroui/react";
export { popoverVariants } from "@heroui/styles";
export type PopoverVariants = CustomPopoverVariants;

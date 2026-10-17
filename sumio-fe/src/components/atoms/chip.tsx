import {
  Chip as HeroUIChip,
  ChipLabel,
  ChipRoot as HeroUIChipRoot,
  type ChipLabelProps,
  type ChipProps as HeroUIChipProps,
  type ChipRootProps,
} from "@heroui/react";
import { chipVariants, tv, type VariantProps } from "@heroui/styles";

import { cn } from "./cn";

export const customChipVariants = tv({
  extend: chipVariants,
  base: "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-all select-none",
  variants: {
    intent: {
      default: "bg-surface-secondary text-foreground border border-border/40",
      accent: "bg-accent/12 text-accent border border-accent/20",
      secondary: "bg-surface-secondary text-foreground-secondary border border-border",
      success: "bg-success/12 text-success border border-success/20",
      income: "bg-success/12 text-finance-income border border-finance-income/20",
      danger: "bg-danger/12 text-danger border border-danger/20",
      expense: "bg-danger/12 text-finance-expense border border-finance-expense/20",
      warning: "bg-warning/20 text-warning border border-warning/30",
      pending: "bg-warning/20 text-finance-pending border border-finance-pending/30",
      sand: "bg-sand/15 text-sand border border-sand/30",
    },
  },
  defaultVariants: {
    intent: "default",
  },
});

export type CustomChipVariants = VariantProps<typeof customChipVariants>;

export interface ChipProps extends Omit<HeroUIChipProps, "className">, CustomChipVariants {
  className?: string;
}

function ChipBase({ intent, className, ...props }: ChipProps) {
  const slots = customChipVariants({ intent });
  const baseClass = typeof slots === "object" && "base" in slots ? slots.base() : "";

  return <HeroUIChip className={cn(baseClass, className)} {...props} />;
}

export const Chip = Object.assign(ChipBase, {
  Root: HeroUIChipRoot,
  Label: ChipLabel,
});

export const ChipRoot = HeroUIChipRoot;
export { ChipLabel };
export type { ChipLabelProps, ChipRootProps, CustomChipVariants as ChipVariants };
export { chipVariants } from "@heroui/styles";

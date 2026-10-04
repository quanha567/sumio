import { Chip as HeroUIChip, ChipLabel as HeroUIChipLabel } from "@heroui/react";
import type { ComponentProps } from "react";

export type ChipProps = ComponentProps<typeof HeroUIChip>;
export type ChipLabelProps = ComponentProps<typeof HeroUIChipLabel>;

export function Chip({ className = "", children, ...props }: ChipProps) {
  return (
    <HeroUIChip
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${className}`}
      {...props}
    >
      {children}
    </HeroUIChip>
  );
}

export function ChipLabel({ className = "", children, ...props }: ChipLabelProps) {
  return (
    <HeroUIChipLabel className={className} {...props}>
      {children}
    </HeroUIChipLabel>
  );
}

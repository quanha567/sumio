import {
  Separator as HeroUISeparator,
  SeparatorRoot,
  type SeparatorProps as HeroUISeparatorProps,
} from "@heroui/react";
import { separatorVariants, tv, type VariantProps } from "@heroui/styles";
import type { ReactNode } from "react";

import { cn } from "./cn";

export const customSeparatorVariants = tv({
  extend: separatorVariants,
  base: "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
});

export type CustomSeparatorVariants = VariantProps<typeof customSeparatorVariants>;

export interface SeparatorProps extends HeroUISeparatorProps {
  className?: string;
  label?: ReactNode;
}

function BaseSeparator({ className, label, ...props }: SeparatorProps) {
  if (label) {
    return (
      <div className={cn("relative flex items-center justify-center", className)}>
        <HeroUISeparator className={customSeparatorVariants()} {...props} />
        <span className="bg-surface text-muted absolute px-3 text-xs font-medium tracking-wider uppercase">
          {label}
        </span>
      </div>
    );
  }

  return <HeroUISeparator className={cn(customSeparatorVariants(), className)} {...props} />;
}

export const Separator = Object.assign(BaseSeparator, {
  Root: SeparatorRoot,
});

export { SeparatorRoot };
export { separatorVariants };
export type SeparatorVariants = CustomSeparatorVariants;

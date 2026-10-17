import {
  Toolbar as HeroUIToolbar,
  ToolbarRoot,
  type ToolbarProps as HeroUIToolbarProps,
} from "@heroui/react";
import { toolbarVariants, tv, type VariantProps } from "@heroui/styles";

import { cn } from "./cn";

export const customToolbarVariants = tv({
  extend: toolbarVariants,
  base: "flex items-center gap-2",
  variants: {
    variant: {
      default: "",
      surface: "bg-surface-secondary/40 border border-border/50 rounded-xl",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type CustomToolbarVariants = VariantProps<typeof customToolbarVariants>;

export interface ToolbarProps extends HeroUIToolbarProps, CustomToolbarVariants {
  className?: string;
}

function BaseToolbar({ className, variant, ...props }: ToolbarProps) {
  return <HeroUIToolbar className={cn(customToolbarVariants({ variant }), className)} {...props} />;
}

export const Toolbar = Object.assign(BaseToolbar, {
  Root: ToolbarRoot,
});

export { ToolbarRoot };
export type { ToolbarRootProps } from "@heroui/react";
export { toolbarVariants };
export type ToolbarVariants = CustomToolbarVariants;

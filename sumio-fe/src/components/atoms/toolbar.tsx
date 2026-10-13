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
});

export type CustomToolbarVariants = VariantProps<typeof customToolbarVariants>;

export interface ToolbarProps extends HeroUIToolbarProps {
  className?: string;
}

function BaseToolbar({ className, ...props }: ToolbarProps) {
  return <HeroUIToolbar className={cn(customToolbarVariants(), className)} {...props} />;
}

export const Toolbar = Object.assign(BaseToolbar, {
  Root: ToolbarRoot,
});

export { ToolbarRoot };
export type { ToolbarRootProps } from "@heroui/react";
export { toolbarVariants };
export type ToolbarVariants = CustomToolbarVariants;

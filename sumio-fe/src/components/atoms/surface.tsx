import {
  Surface as HeroUISurface,
  SurfaceContext,
  SurfaceRoot,
  type SurfaceProps as HeroUISurfaceProps,
} from "@heroui/react";
import { surfaceVariants, tv, type VariantProps } from "@heroui/styles";

import { cn } from "./cn";

export const customSurfaceVariants = tv({
  extend: surfaceVariants,
  base: "bg-surface border border-border text-foreground rounded-xl",
});

export type CustomSurfaceVariants = VariantProps<typeof customSurfaceVariants>;

export interface SurfaceProps extends HeroUISurfaceProps {
  className?: string;
}

function BaseSurface({ className, ...props }: SurfaceProps) {
  return <HeroUISurface className={cn(customSurfaceVariants(), className)} {...props} />;
}

export const Surface = Object.assign(BaseSurface, {
  Root: SurfaceRoot,
  Context: SurfaceContext,
});

export { SurfaceRoot, SurfaceContext };
export type { SurfaceRootProps } from "@heroui/react";
export { surfaceVariants };
export type SurfaceVariants = CustomSurfaceVariants;

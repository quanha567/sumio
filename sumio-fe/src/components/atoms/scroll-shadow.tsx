import {
  ScrollShadow as HeroUIScrollShadow,
  ScrollShadowRoot,
  type ScrollShadowProps as HeroUIScrollShadowProps,
  useScrollShadow,
} from "@heroui/react";
import { scrollShadowVariants, tv, type VariantProps } from "@heroui/styles";

import { cn } from "./cn";

export const customScrollShadowVariants = tv({
  extend: scrollShadowVariants,
});

export type CustomScrollShadowVariants = VariantProps<typeof customScrollShadowVariants>;

export interface ScrollShadowProps extends HeroUIScrollShadowProps {
  className?: string;
}

function BaseScrollShadow({ className, ...props }: ScrollShadowProps) {
  return <HeroUIScrollShadow className={cn(customScrollShadowVariants(), className)} {...props} />;
}

export const ScrollShadow = Object.assign(BaseScrollShadow, {
  Root: ScrollShadowRoot,
});

export { ScrollShadowRoot, useScrollShadow };
export { scrollShadowVariants };
export type ScrollShadowVariants = CustomScrollShadowVariants;

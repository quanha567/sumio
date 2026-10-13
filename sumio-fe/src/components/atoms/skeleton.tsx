import {
  Skeleton as HeroUISkeleton,
  SkeletonRoot,
  type SkeletonProps as HeroUISkeletonProps,
} from "@heroui/react";
import { skeletonVariants, tv, type VariantProps } from "@heroui/styles";

import { cn } from "./cn";

export const customSkeletonVariants = tv({
  extend: skeletonVariants,
  base: "bg-surface-secondary/80 animate-pulse",
  variants: {
    shape: {
      rectangle: "rounded-md",
      circle: "rounded-full",
      pill: "rounded-full",
    },
  },
  defaultVariants: {
    shape: "rectangle",
  },
});

export type CustomSkeletonVariants = VariantProps<typeof customSkeletonVariants>;

export interface SkeletonProps extends HeroUISkeletonProps {
  className?: string;
  shape?: "rectangle" | "circle" | "pill";
}

function BaseSkeleton({ className, shape = "rectangle", ...props }: SkeletonProps) {
  return <HeroUISkeleton className={cn(customSkeletonVariants({ shape }), className)} {...props} />;
}

export const Skeleton = Object.assign(BaseSkeleton, {
  Root: SkeletonRoot,
});

export { SkeletonRoot };
export { skeletonVariants };
export type SkeletonVariants = CustomSkeletonVariants;

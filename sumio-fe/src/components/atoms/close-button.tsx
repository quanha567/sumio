import {
  CloseButton as HeroUICloseButton,
  CloseButtonRoot,
  type CloseButtonProps as HeroUICloseButtonProps,
} from "@heroui/react";
import { closeButtonVariants, tv, type VariantProps } from "@heroui/styles";

import { cn } from "./cn";

export const customCloseButtonVariants = tv({
  extend: closeButtonVariants,
  base: "text-muted hover:text-foreground hover:bg-surface-secondary rounded-md p-1 transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-focus",
});

export type CustomCloseButtonVariants = VariantProps<typeof customCloseButtonVariants>;

export interface CloseButtonProps extends HeroUICloseButtonProps {
  className?: string;
}

function BaseCloseButton({ className, ...props }: CloseButtonProps) {
  return <HeroUICloseButton className={cn(customCloseButtonVariants(), className)} {...props} />;
}

export const CloseButton = Object.assign(BaseCloseButton, {
  Root: CloseButtonRoot,
});

export { CloseButtonRoot };
export { closeButtonVariants };
export type CloseButtonVariants = CustomCloseButtonVariants;

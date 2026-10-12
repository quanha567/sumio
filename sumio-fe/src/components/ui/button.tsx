import { Button as HeroUIButton, ButtonGroup, ButtonGroupSeparator } from "@heroui/react";
import { buttonVariants, tv, type VariantProps } from "@heroui/styles";
import type { ComponentProps } from "react";

import { type UnifiedColor } from "./tone";

export const customButtonVariants = tv({
  extend: buttonVariants,
  base: "select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 font-medium",
  variants: {
    intent: {
      primary: "bg-accent text-accent-foreground hover:bg-accent-hover shadow-xs",
      secondary:
        "bg-surface border border-border text-foreground hover:bg-surface-secondary shadow-xs",
      ghost: "bg-transparent text-foreground hover:bg-surface-secondary shadow-none",
      danger: "bg-danger text-danger-foreground hover:bg-danger/90 shadow-xs",
      outline:
        "bg-transparent border border-border text-foreground hover:bg-surface-secondary shadow-xs",
    },
    size: {
      sm: "min-h-9 sm:min-h-8 px-2.5 sm:px-2 text-xs",
      md: "min-h-10 sm:min-h-9 px-3.5 sm:px-3 text-base sm:text-sm",
      lg: "min-h-12 sm:min-h-11 px-4 text-base",
    },
  },
  defaultVariants: {
    intent: "primary",
    size: "md",
  },
});

export type CustomButtonVariants = VariantProps<typeof customButtonVariants>;

export interface ButtonProps
  extends Omit<ComponentProps<typeof HeroUIButton>, "color" | "className">, CustomButtonVariants {
  className?: string;
  disabled?: boolean;
  color?: UnifiedColor;
  title?: string;
}

function resolveIntent(
  intent?: CustomButtonVariants["intent"],
  variant?: ComponentProps<typeof HeroUIButton>["variant"],
  color?: UnifiedColor,
): CustomButtonVariants["intent"] {
  if (intent) return intent;
  if (variant === "outline") return "outline";
  if (variant === "danger" || variant === "danger-soft") return "danger";
  if (variant === "tertiary" || variant === "ghost") return "ghost";
  if (variant === "secondary") return "secondary";
  if (color === "danger" || color === "expense") return "danger";
  if (color === "secondary" || color === "default" || color === "neutral") return "secondary";
  if (color === "primary" || color === "accent") return "primary";
  return undefined;
}

function ButtonBase({
  disabled,
  isDisabled,
  color,
  variant,
  intent,
  className,
  ...props
}: ButtonProps) {
  const resolvedIntent = resolveIntent(intent, variant, color);

  return (
    <HeroUIButton
      variant={variant}
      isDisabled={disabled ?? isDisabled}
      className={customButtonVariants({
        intent: resolvedIntent,
        className,
      })}
      {...props}
    />
  );
}

export const Button = Object.assign(ButtonBase, {
  Group: ButtonGroup,
  Root: HeroUIButton.Root,
});

export const ButtonRoot = HeroUIButton.Root;
export { ButtonGroup, ButtonGroupSeparator };
export type { ButtonGroupProps, ButtonGroupSeparatorProps, ButtonVariants } from "@heroui/react";
export { buttonVariants } from "@heroui/styles";

import {
  Checkbox as HeroUICheckbox,
  CheckboxContent,
  CheckboxControl,
  CheckboxGroup,
  CheckboxIndicator,
  CheckboxRoot,
} from "@heroui/react";
import { checkboxGroupVariants, checkboxVariants, tv, type VariantProps } from "@heroui/styles";
import type { OnToggle } from "@sumio/common";
import type { ComponentProps } from "react";

import { cn } from "./cn";
import type { UnifiedColor } from "./tone";

export const customCheckboxVariants = tv({
  extend: checkboxVariants,
  slots: {
    control:
      "rounded-sm border-border data-selected:bg-accent data-selected:border-accent text-accent-foreground transition-all",
  },
});

export type CustomCheckboxVariants = VariantProps<typeof customCheckboxVariants>;

export interface CheckboxProps extends Omit<
  ComponentProps<typeof HeroUICheckbox>,
  "onChange" | "className"
> {
  className?: string;
  onValueChange?: OnToggle;
  onChange?: OnToggle;
  disabled?: boolean;
  color?: UnifiedColor;
}

function resolveCheckboxVariant(
  variant?: ComponentProps<typeof HeroUICheckbox>["variant"],
  color?: UnifiedColor,
): ComponentProps<typeof HeroUICheckbox>["variant"] {
  if (variant === "primary" || variant === "secondary") return variant;
  if (color === "accent" || color === "primary") return "primary";
  if (color === "neutral" || color === "default" || color === "secondary") return "secondary";
  return undefined;
}

function BaseCheckbox({
  onValueChange,
  onChange,
  disabled,
  isDisabled,
  color,
  variant,
  className,
  ...props
}: CheckboxProps) {
  const slots = customCheckboxVariants();

  return (
    <HeroUICheckbox
      variant={resolveCheckboxVariant(variant, color)}
      isDisabled={disabled ?? isDisabled}
      className={cn(slots.base?.(), className)}
      onChange={(isSelected: boolean) => {
        onValueChange?.(isSelected);
        onChange?.(isSelected);
      }}
      {...props}
    />
  );
}

export const Checkbox = Object.assign(BaseCheckbox, {
  Group: CheckboxGroup,
  Control: CheckboxControl,
  Indicator: CheckboxIndicator,
  Content: CheckboxContent,
  Root: CheckboxRoot,
});

export { CheckboxRoot, CheckboxGroup, CheckboxControl, CheckboxIndicator, CheckboxContent };
export type CheckboxGroupVariants = VariantProps<typeof checkboxGroupVariants>;
export type {
  CheckboxGroupProps,
  CheckboxControlProps,
  CheckboxIndicatorProps,
  CheckboxContentProps,
} from "@heroui/react";
export type { CustomCheckboxVariants as CheckboxVariants };
export { checkboxVariants, checkboxGroupVariants } from "@heroui/styles";

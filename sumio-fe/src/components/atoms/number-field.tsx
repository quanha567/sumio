import {
  NumberField as HeroUINumberField,
  NumberFieldDecrementButton,
  NumberFieldGroup,
  NumberFieldIncrementButton,
  NumberFieldInput as HeroUINumberFieldInput,
  NumberFieldRoot,
} from "@heroui/react";
import { numberFieldVariants, tv, type VariantProps } from "@heroui/styles";
import type { ComponentProps } from "react";

import { cn } from "./cn";

export const customNumberFieldVariants = tv({
  extend: numberFieldVariants,
});

export type CustomNumberFieldVariants = VariantProps<typeof customNumberFieldVariants>;

function NumberFieldInputBase({
  className,
  ...props
}: ComponentProps<typeof HeroUINumberFieldInput>) {
  return (
    <HeroUINumberFieldInput
      className={cn(
        "rounded-md border border-border bg-field-background text-field-foreground placeholder:text-field-placeholder focus:border-focus focus-visible:outline-2 focus-visible:outline-focus transition-all h-9 px-3 text-sm tabular-nums",
        className,
      )}
      {...props}
    />
  );
}

export const NumberField = Object.assign(HeroUINumberField, {
  Root: NumberFieldRoot,
  Group: NumberFieldGroup,
  Input: NumberFieldInputBase,
  IncrementButton: NumberFieldIncrementButton,
  DecrementButton: NumberFieldDecrementButton,
});

export const NumberFieldInput = NumberFieldInputBase;

export {
  NumberFieldRoot,
  NumberFieldGroup,
  NumberFieldIncrementButton,
  NumberFieldDecrementButton,
};

export type { NumberFieldProps } from "@heroui/react";
export { numberFieldVariants };
export type NumberFieldVariants = CustomNumberFieldVariants;

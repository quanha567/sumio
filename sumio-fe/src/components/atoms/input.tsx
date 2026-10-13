import {
  Input as HeroUIInput,
  InputGroup,
  InputGroupInput,
  InputGroupPrefix,
  InputGroupSuffix,
  InputGroupTextArea,
  InputRoot,
} from "@heroui/react";
import { inputVariants, tv, type VariantProps } from "@heroui/styles";
import type { ComponentProps } from "react";

import { cn } from "./cn";

export const customInputVariants = tv({
  extend: inputVariants,
  base: "rounded-md border bg-field-background text-field-foreground placeholder:text-field-placeholder min-h-10 sm:min-h-9 px-3 text-base sm:text-sm focus-visible:outline-2 focus-visible:outline-focus transition-all",
  variants: {
    intent: {
      default: "border-border focus:border-focus",
      error: "border-danger focus:border-danger text-danger",
      success: "border-success focus:border-success",
    },
  },
  defaultVariants: {
    intent: "default",
  },
});

export type CustomInputVariants = VariantProps<typeof customInputVariants>;

export interface InputProps
  extends Omit<ComponentProps<typeof HeroUIInput>, "className">, CustomInputVariants {
  className?: string;
  isDisabled?: boolean;
}

function BaseInput({ disabled, isDisabled, intent, className, ...props }: InputProps) {
  return (
    <HeroUIInput
      disabled={disabled ?? isDisabled}
      className={cn(customInputVariants({ intent }), className)}
      {...props}
    />
  );
}

export const Input = Object.assign(BaseInput, {
  Group: InputGroup,
  Root: InputRoot,
});

export {
  InputRoot,
  InputGroup,
  InputGroupInput,
  InputGroupPrefix,
  InputGroupSuffix,
  InputGroupTextArea,
};
export type {
  InputProps as HeroUIInputProps,
  InputGroupProps,
  InputGroupInputProps,
  InputGroupPrefixProps,
  InputGroupSuffixProps,
  InputGroupTextAreaProps,
  InputGroupVariants,
} from "@heroui/react";
export type { CustomInputVariants as InputVariants };
export { inputVariants, inputGroupVariants } from "@heroui/styles";

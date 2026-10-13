import {
  TextArea as HeroUITextArea,
  TextAreaRoot,
  type TextAreaProps as HeroUITextAreaProps,
} from "@heroui/react";
import { textAreaVariants, tv, type VariantProps } from "@heroui/styles";

import { cn } from "./cn";

export const customTextAreaVariants = tv({
  extend: textAreaVariants,
  base: "rounded-md border border-border bg-field-background text-field-foreground placeholder:text-field-placeholder focus:border-focus focus-visible:outline-2 focus-visible:outline-focus transition-all p-2.5 text-sm",
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

export type CustomTextAreaVariants = VariantProps<typeof customTextAreaVariants>;

export interface TextAreaProps
  extends Omit<HeroUITextAreaProps, "className">, CustomTextAreaVariants {
  className?: string;
  isDisabled?: boolean;
}

function BaseTextArea({ disabled, isDisabled, intent, className, ...props }: TextAreaProps) {
  return (
    <HeroUITextArea
      disabled={disabled ?? isDisabled}
      className={cn(customTextAreaVariants({ intent }), className)}
      {...props}
    />
  );
}

export const TextArea = Object.assign(BaseTextArea, {
  Root: TextAreaRoot,
});

export { TextAreaRoot };
export type { TextAreaRootProps } from "@heroui/react";
export { textAreaVariants };
export type TextAreaVariants = CustomTextAreaVariants;

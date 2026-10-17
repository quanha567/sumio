import {
  Description,
  FieldError,
  InputGroup,
  InputGroupInput,
  InputGroupPrefix,
  InputGroupSuffix,
  Label,
  TextFieldContext,
  TextFieldRoot,
} from "@heroui/react";
import { textFieldVariants, tv, type VariantProps } from "@heroui/styles";
import type { ComponentProps, ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import type { RegisterOptions } from "react-hook-form";

import { cn } from "./cn";
import { Input } from "./input";

export const customTextFieldVariants = tv({
  extend: textFieldVariants,
  base: "w-full space-y-1.5",
});

export type CustomTextFieldVariants = VariantProps<typeof customTextFieldVariants>;

export interface TextFieldProps
  extends Omit<ComponentProps<typeof Input>, "prefix">, CustomTextFieldVariants {
  label?: ReactNode;
  name?: string;
  fieldId?: string;
  rules?: RegisterOptions;
  prefix?: ReactNode;
  suffix?: ReactNode;
  description?: ReactNode;
  errorMessage?: ReactNode;
  isInvalid?: boolean;
  isRequired?: boolean;
  inputClassName?: string;
}

function BaseTextField({
  label,
  name,
  fieldId,
  rules,
  prefix,
  suffix,
  description,
  errorMessage,
  isInvalid,
  isRequired,
  disabled,
  isDisabled,
  intent,
  className,
  inputClassName,
  ...props
}: TextFieldProps) {
  let formContext = null;
  try {
    formContext = useFormContext();
  } catch {
    // Optional outside FormProvider
  }

  const effectiveName = name ?? fieldId;
  const fieldRegistration =
    formContext && effectiveName ? formContext.register(effectiveName, rules) : {};
  const formError =
    formContext && effectiveName
      ? (formContext.formState.errors[effectiveName]?.message as ReactNode)
      : undefined;

  const resolvedErrorMessage = errorMessage ?? formError;
  const resolvedIsInvalid = isInvalid ?? Boolean(resolvedErrorMessage);
  const resolvedIntent = resolvedIsInvalid ? "error" : (intent ?? "default");

  return (
    <TextFieldRoot
      className={cn("w-full space-y-1.5", className)}
      isInvalid={resolvedIsInvalid}
      isRequired={isRequired}
    >
      {label && (
        <Label className="text-foreground block text-xs font-medium sm:text-sm">{label}</Label>
      )}

      <div className="relative">
        {prefix && (
          <div className="text-muted pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            {prefix}
          </div>
        )}

        <Input
          intent={resolvedIntent}
          disabled={disabled ?? isDisabled}
          className={cn("w-full", prefix && "pl-10", suffix && "pr-10", inputClassName)}
          {...fieldRegistration}
          {...props}
        />

        {suffix && (
          <div className="text-muted absolute inset-y-0 right-0 flex items-center pr-1.5">
            {suffix}
          </div>
        )}
      </div>

      {description && <Description className="text-muted text-xs">{description}</Description>}
      {resolvedErrorMessage && (
        <FieldError className="text-danger text-xs">{resolvedErrorMessage}</FieldError>
      )}
    </TextFieldRoot>
  );
}

export const TextField = Object.assign(BaseTextField, {
  Root: TextFieldRoot,
  Context: TextFieldContext,
  Label,
  Group: InputGroup,
  Prefix: InputGroupPrefix,
  Suffix: InputGroupSuffix,
  Input: InputGroupInput,
  Error: FieldError,
  Description,
});

export { TextFieldRoot, TextFieldContext, textFieldVariants };
export type {
  TextFieldProps as HeroUITextFieldProps,
  TextFieldRootProps,
  TextFieldVariants,
} from "@heroui/react";

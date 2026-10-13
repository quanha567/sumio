import {
  FieldError,
  Label,
  ListBox,
  Select as HeroUISelect,
  SelectClearButton,
  SelectIndicator,
  SelectPopover,
  SelectRoot,
  SelectTrigger,
  SelectValue,
} from "@heroui/react";
import { selectVariants, tv, type VariantProps } from "@heroui/styles";
import type { ReactNode } from "react";

import type { OnChange, SelectOption } from "@/types";

import { cn } from "./cn";

export const customSelectVariants = tv({
  extend: selectVariants,
  slots: {
    trigger:
      "rounded-md border border-border bg-field-background text-field-foreground focus-visible:outline-focus transition-all",
    popover: "rounded-card border border-border bg-overlay text-overlay-foreground shadow-md p-1",
  },
});

export type CustomSelectVariants = VariantProps<typeof customSelectVariants>;

export {
  SelectClearButton,
  SelectIndicator,
  SelectPopover,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  selectVariants,
};

export type {
  SelectProps,
  SelectClearButtonProps,
  SelectIndicatorProps,
  SelectPopoverProps,
  SelectRootProps,
  SelectTriggerProps,
  SelectValueProps,
} from "@heroui/react";
import { useFormContext } from "react-hook-form";

export type { CustomSelectVariants as SelectVariants };

export interface SelectFieldProps {
  label?: ReactNode;
  name?: string;
  fieldId?: string;
  ariaLabel?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onChange?: OnChange<string>;
  className?: string;
  variant?: "primary" | "secondary";
  isDisabled?: boolean;
  isRequired?: boolean;
  errorMessage?: ReactNode;
}

export function SelectField({
  label,
  name,
  fieldId,
  ariaLabel,
  placeholder = "Select an option...",
  options,
  value,
  onChange,
  className,
  variant = "primary",
  isDisabled,
  isRequired,
  errorMessage,
}: SelectFieldProps) {
  let formContext = null;
  try {
    formContext = useFormContext();
  } catch {
    // Optional outside FormProvider
  }

  const effectiveName = name ?? fieldId;
  const formValue =
    formContext && effectiveName
      ? (formContext.watch(effectiveName) as string | undefined)
      : undefined;
  const formError =
    formContext && effectiveName
      ? (formContext.formState.errors[effectiveName]?.message as ReactNode)
      : undefined;

  const resolvedValue = value ?? formValue;
  const resolvedErrorMessage = errorMessage ?? formError;

  const handleSelection = (selected: string) => {
    if (formContext && effectiveName) {
      formContext.setValue(effectiveName, selected, { shouldValidate: true });
    }
    onChange?.(selected);
  };

  return (
    <HeroUISelect
      aria-label={ariaLabel || (typeof label === "string" ? label : "Select")}
      variant={variant}
      fullWidth
      selectedKey={resolvedValue || null}
      onSelectionChange={(key) => {
        if (key !== null) {
          handleSelection(String(key));
        }
      }}
      isDisabled={isDisabled}
      isRequired={isRequired}
      placeholder={placeholder}
      className={cn("w-full space-y-1.5", className)}
    >
      {label && (
        <Label className="text-foreground block text-xs font-medium sm:text-sm">{label}</Label>
      )}
      <HeroUISelect.Trigger className="border-border bg-field-background text-field-foreground focus-visible:outline-focus flex h-11 w-full items-center justify-between rounded-md border px-3 text-sm transition-all focus-visible:outline-2">
        <HeroUISelect.Value className="truncate text-left text-sm" />
        <HeroUISelect.Indicator className="text-muted shrink-0" />
      </HeroUISelect.Trigger>
      <HeroUISelect.Popover className="bg-overlay text-overlay-foreground border-border z-50 min-w-[var(--trigger-width)] rounded-md border p-1 shadow-lg">
        <ListBox className="gap-0.5 p-0">
          {options.map((opt) => (
            <ListBox.Item
              key={opt.id}
              id={opt.id}
              textValue={opt.label}
              className="hover:bg-surface-secondary text-foreground data-selected:text-accent flex cursor-pointer items-center justify-between rounded-sm px-2.5 py-1.5 text-xs data-selected:font-semibold"
            >
              {opt.label}
            </ListBox.Item>
          ))}
        </ListBox>
      </HeroUISelect.Popover>
      {resolvedErrorMessage && (
        <FieldError className="text-danger text-xs">{resolvedErrorMessage}</FieldError>
      )}
    </HeroUISelect>
  );
}

export const Select = Object.assign(HeroUISelect, {
  Field: SelectField,
});

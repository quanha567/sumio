import {
  Autocomplete as HeroUIAutocomplete,
  AutocompleteClearButton,
  AutocompleteFilter,
  AutocompleteIndicator,
  AutocompletePopover as HeroUIAutocompletePopover,
  AutocompleteRoot,
  AutocompleteTrigger,
  AutocompleteValue,
  ComboBox as HeroUIComboBox,
  ComboBoxInputGroup,
  ComboBoxPopover as HeroUIComboBoxPopover,
  ComboBoxRoot,
  ComboBoxTrigger,
  ComboBoxValue,
} from "@heroui/react";
import { autocompleteVariants, comboBoxVariants } from "@heroui/styles";
import type { ComponentProps } from "react";

import { cn } from "./cn";

function AutocompletePopoverBase({
  className,
  ...props
}: ComponentProps<typeof HeroUIAutocompletePopover>) {
  return (
    <HeroUIAutocompletePopover
      className={cn(
        "bg-overlay text-overlay-foreground border border-border rounded-lg shadow-md p-1 outline-none overflow-hidden",
        className,
      )}
      {...props}
    />
  );
}

function ComboBoxPopoverBase({
  className,
  ...props
}: ComponentProps<typeof HeroUIComboBoxPopover>) {
  return (
    <HeroUIComboBoxPopover
      className={cn(
        "bg-overlay text-overlay-foreground border border-border rounded-lg shadow-md p-1 outline-none overflow-hidden",
        className,
      )}
      {...props}
    />
  );
}

export const Autocomplete = Object.assign(HeroUIAutocomplete, {
  Root: AutocompleteRoot,
  Trigger: AutocompleteTrigger,
  Value: AutocompleteValue,
  Indicator: AutocompleteIndicator,
  Popover: AutocompletePopoverBase,
  Filter: AutocompleteFilter,
  ClearButton: AutocompleteClearButton,
});

export const ComboBox = Object.assign(HeroUIComboBox, {
  Root: ComboBoxRoot,
  InputGroup: ComboBoxInputGroup,
  Value: ComboBoxValue,
  Trigger: ComboBoxTrigger,
  Popover: ComboBoxPopoverBase,
});

export const AutocompletePopover = AutocompletePopoverBase;
export const ComboBoxPopover = ComboBoxPopoverBase;

export {
  AutocompleteRoot,
  AutocompleteTrigger,
  AutocompleteValue,
  AutocompleteIndicator,
  AutocompleteFilter,
  AutocompleteClearButton,
  ComboBoxRoot,
  ComboBoxInputGroup,
  ComboBoxValue,
  ComboBoxTrigger,
};

export type { AutocompleteProps, ComboBoxProps } from "@heroui/react";
export { autocompleteVariants, comboBoxVariants };

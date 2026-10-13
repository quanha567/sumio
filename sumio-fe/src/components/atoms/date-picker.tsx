import {
  DateField,
  DateFieldRoot,
  DatePicker as HeroUIDatePicker,
  DatePickerPopover as HeroUIDatePickerPopover,
  DatePickerRoot,
  DatePickerTrigger,
  DatePickerTriggerIndicator,
  DateRangePicker as HeroUIDateRangePicker,
  DateRangePickerPopover as HeroUIDateRangePickerPopover,
  DateRangePickerRangeSeparator,
  DateRangePickerRoot,
  DateRangePickerTrigger,
  DateRangePickerTriggerIndicator,
} from "@heroui/react";
import { dateFieldVariants, datePickerVariants, dateRangePickerVariants } from "@heroui/styles";
import type { ComponentProps } from "react";

import { cn } from "./cn";

function DatePickerPopoverBase({
  className,
  ...props
}: ComponentProps<typeof HeroUIDatePickerPopover>) {
  return (
    <HeroUIDatePickerPopover
      className={cn(
        "bg-overlay text-overlay-foreground border border-border rounded-xl shadow-lg p-3 outline-none",
        className,
      )}
      {...props}
    />
  );
}

function DateRangePickerPopoverBase({
  className,
  ...props
}: ComponentProps<typeof HeroUIDateRangePickerPopover>) {
  return (
    <HeroUIDateRangePickerPopover
      className={cn(
        "bg-overlay text-overlay-foreground border border-border rounded-xl shadow-lg p-3 outline-none",
        className,
      )}
      {...props}
    />
  );
}

export const DatePicker = Object.assign(HeroUIDatePicker, {
  Root: DatePickerRoot,
  Trigger: DatePickerTrigger,
  TriggerIndicator: DatePickerTriggerIndicator,
  Popover: DatePickerPopoverBase,
});

export const DateRangePicker = Object.assign(HeroUIDateRangePicker, {
  Root: DateRangePickerRoot,
  Trigger: DateRangePickerTrigger,
  TriggerIndicator: DateRangePickerTriggerIndicator,
  RangeSeparator: DateRangePickerRangeSeparator,
  Popover: DateRangePickerPopoverBase,
});

export const DatePickerPopover = DatePickerPopoverBase;
export const DateRangePickerPopover = DateRangePickerPopoverBase;

export {
  DatePickerRoot,
  DatePickerTrigger,
  DatePickerTriggerIndicator,
  DateRangePickerRoot,
  DateRangePickerTrigger,
  DateRangePickerTriggerIndicator,
  DateRangePickerRangeSeparator,
  DateField,
  DateFieldRoot,
};

export type { DatePickerProps, DateRangePickerProps, DateFieldProps } from "@heroui/react";
export { datePickerVariants, dateRangePickerVariants, dateFieldVariants };

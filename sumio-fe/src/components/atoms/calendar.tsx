import {
  Calendar as HeroUICalendar,
  CalendarCell as HeroUICalendarCell,
  CalendarCellIndicator,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeader,
  CalendarHeaderCell,
  CalendarHeading,
  CalendarNavButton,
  CalendarRoot,
  CalendarYearPickerCell,
  CalendarYearPickerGrid,
  CalendarYearPickerGridBody,
  CalendarYearPickerTrigger,
  CalendarYearPickerTriggerHeading,
  CalendarYearPickerTriggerIndicator,
  RangeCalendar as HeroUIRangeCalendar,
  RangeCalendarCell,
  RangeCalendarCellIndicator,
  RangeCalendarGrid,
  RangeCalendarGridBody,
  RangeCalendarGridHeader,
  RangeCalendarHeader,
  RangeCalendarHeaderCell,
  RangeCalendarHeading,
  RangeCalendarNavButton,
  RangeCalendarRoot,
} from "@heroui/react";
import {
  calendarVariants,
  calendarYearPickerVariants,
  rangeCalendarVariants,
  tv,
} from "@heroui/styles";
import type { ComponentProps } from "react";

import { cn } from "./cn";

export const customCalendarVariants = tv({
  extend: calendarVariants,
  base: "bg-surface border border-border rounded-xl p-3 text-foreground",
});

function CalendarBase({ className, ...props }: ComponentProps<typeof HeroUICalendar>) {
  return <HeroUICalendar className={cn(customCalendarVariants(), className)} {...props} />;
}

function CalendarCellBase({ className, ...props }: ComponentProps<typeof HeroUICalendarCell>) {
  return (
    <HeroUICalendarCell
      className={cn(
        "rounded-md hover:bg-surface-secondary data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground font-medium text-sm transition-colors",
        className,
      )}
      {...props}
    />
  );
}

export const Calendar = Object.assign(CalendarBase, {
  Root: CalendarRoot,
  Header: CalendarHeader,
  Heading: CalendarHeading,
  NavButton: CalendarNavButton,
  Grid: CalendarGrid,
  GridHeader: CalendarGridHeader,
  GridBody: CalendarGridBody,
  HeaderCell: CalendarHeaderCell,
  Cell: CalendarCellBase,
  CellIndicator: CalendarCellIndicator,
  YearPickerTrigger: CalendarYearPickerTrigger,
  YearPickerTriggerHeading: CalendarYearPickerTriggerHeading,
  YearPickerTriggerIndicator: CalendarYearPickerTriggerIndicator,
  YearPickerGrid: CalendarYearPickerGrid,
  YearPickerGridBody: CalendarYearPickerGridBody,
  YearPickerCell: CalendarYearPickerCell,
});

export const CalendarCell = CalendarCellBase;

export const RangeCalendar = Object.assign(HeroUIRangeCalendar, {
  Root: RangeCalendarRoot,
  Header: RangeCalendarHeader,
  Heading: RangeCalendarHeading,
  NavButton: RangeCalendarNavButton,
  Grid: RangeCalendarGrid,
  GridHeader: RangeCalendarGridHeader,
  GridBody: RangeCalendarGridBody,
  HeaderCell: RangeCalendarHeaderCell,
  Cell: RangeCalendarCell,
  CellIndicator: RangeCalendarCellIndicator,
});

export {
  CalendarRoot,
  CalendarHeader,
  CalendarHeading,
  CalendarNavButton,
  CalendarGrid,
  CalendarGridHeader,
  CalendarGridBody,
  CalendarHeaderCell,
  CalendarCellIndicator,
  CalendarYearPickerTrigger,
  CalendarYearPickerTriggerHeading,
  CalendarYearPickerTriggerIndicator,
  CalendarYearPickerGrid,
  CalendarYearPickerGridBody,
  CalendarYearPickerCell,
  RangeCalendarRoot,
  RangeCalendarHeader,
  RangeCalendarHeading,
  RangeCalendarNavButton,
  RangeCalendarGrid,
  RangeCalendarGridHeader,
  RangeCalendarGridBody,
  RangeCalendarHeaderCell,
  RangeCalendarCell,
  RangeCalendarCellIndicator,
};

export type { CalendarProps, RangeCalendarProps } from "@heroui/react";
export { calendarVariants, calendarYearPickerVariants, rangeCalendarVariants };

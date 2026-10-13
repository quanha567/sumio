import {
  Table as HeroUITable,
  TableBody,
  TableCell,
  TableCollection,
  TableColumn,
  TableColumnResizer,
  TableContent,
  TableFooter,
  TableHeader,
  TableLayout,
  TableLoadMoreContent,
  TableLoadMoreItem,
  TableResizableContainer,
  TableRoot,
  TableRow,
  TableScrollContainer,
  TableSortableColumnHeader,
} from "@heroui/react";
import { tableVariants, tv, type VariantProps } from "@heroui/styles";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "./cn";

export const customTableVariants = tv({
  extend: tableVariants,
  slots: {
    container: "w-full overflow-hidden rounded-card border border-border bg-surface shadow-xs",
    base: "w-full overflow-hidden rounded-card border border-border bg-surface text-foreground shadow-xs",
    header:
      "border-b border-border/60 bg-surface-secondary/50 text-muted text-xs font-semibold tracking-wider uppercase [&_th]:bg-transparent [&_th]:py-3.5 [&_tr]:bg-transparent",
    row: "border-b border-border/40 hover:bg-surface-secondary/40 transition-colors last:border-b-0",
    cell: "px-4 py-3.5 text-sm text-foreground",
    footer:
      "border-t border-border/60 bg-surface px-4 py-3 flex items-center justify-between text-sm",
  },
});

export type CustomTableVariants = VariantProps<typeof customTableVariants>;

export interface TableAdaptiveProps {
  desktop: ReactNode;
  mobile: ReactNode;
  className?: string;
}

/**
 * Standard Sumio Adaptive Data Container:
 * Encapsulates the table vs. mobile-list responsive breakpoint in the UI layer.
 */
export function TableAdaptive({ desktop, mobile, className }: TableAdaptiveProps) {
  return (
    <div className={className}>
      <div className="hidden md:block">{desktop}</div>
      <div className="block md:hidden">{mobile}</div>
    </div>
  );
}

export interface TableContainerProps extends ComponentProps<"div"> {
  className?: string;
  children?: ReactNode;
}

export function TableContainer({ className, children, ...props }: TableContainerProps) {
  const slots = customTableVariants();

  return (
    <div className={cn(slots.container?.(), className)} {...props}>
      {children}
    </div>
  );
}

export function TableHeaderWrapper({ className, ...props }: ComponentProps<typeof TableHeader>) {
  const slots = customTableVariants();

  return <TableHeader className={cn(slots.header?.(), className)} {...props} />;
}

export function TableRowWrapper({ className, ...props }: ComponentProps<typeof TableRow>) {
  const slots = customTableVariants();

  return <TableRow className={cn(slots.row?.(), className)} {...props} />;
}

export function TableCellWrapper({ className, ...props }: ComponentProps<typeof TableCell>) {
  const slots = customTableVariants();

  return <TableCell className={cn(slots.cell?.(), className)} {...props} />;
}

export function TableFooterWrapper({ className, ...props }: ComponentProps<typeof TableFooter>) {
  const slots = customTableVariants();

  return <TableFooter className={cn(slots.footer?.(), className)} {...props} />;
}

export function TableScrollContainerWrapper({
  className,
  ...props
}: ComponentProps<typeof TableScrollContainer>) {
  return (
    <TableScrollContainer
      className={cn(
        "overflow-x-auto [scrollbar-width:thin] scrollbar-none [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/40",
        className,
      )}
      {...props}
    />
  );
}

function TableBase({
  className,
  variant = "secondary",
  ...props
}: ComponentProps<typeof HeroUITable>) {
  const isSecondary = variant === "secondary";
  const slots = customTableVariants();
  const baseClass = isSecondary
    ? "w-full bg-transparent border-0 shadow-none overflow-visible [&_th::after]:hidden"
    : cn(slots.base?.(), "[&_th::after]:hidden");

  return <HeroUITable variant={variant} className={cn(baseClass, className)} {...props} />;
}

export const Table = Object.assign(TableBase, {
  Adaptive: TableAdaptive,
  Container: TableContainer,
  Root: TableRoot,
  Body: TableBody,
  Cell: TableCellWrapper,
  Collection: TableCollection,
  Column: TableColumn,
  ColumnResizer: TableColumnResizer,
  Content: TableContent,
  Footer: TableFooterWrapper,
  Header: TableHeaderWrapper,
  Layout: TableLayout,
  LoadMoreContent: TableLoadMoreContent,
  LoadMoreItem: TableLoadMoreItem,
  ResizableContainer: TableResizableContainer,
  Row: TableRowWrapper,
  ScrollContainer: TableScrollContainerWrapper,
  SortableColumnHeader: TableSortableColumnHeader,
});

export {
  TableRoot,
  TableBody,
  TableCellWrapper as TableCell,
  TableCollection,
  TableColumn,
  TableColumnResizer,
  TableContent,
  TableFooterWrapper as TableFooter,
  TableHeaderWrapper as TableHeader,
  TableLayout,
  TableLoadMoreContent,
  TableLoadMoreItem,
  TableResizableContainer,
  TableRowWrapper as TableRow,
  TableScrollContainerWrapper as TableScrollContainer,
  TableSortableColumnHeader,
};
export type {
  TableProps,
  TableBodyProps,
  TableCellProps,
  TableColumnProps,
  TableContentProps,
  TableFooterProps,
  TableHeaderProps,
  TableRowProps,
  TableScrollContainerProps,
} from "@heroui/react";
export type { CustomTableVariants as TableVariants };
export { tableVariants } from "@heroui/styles";

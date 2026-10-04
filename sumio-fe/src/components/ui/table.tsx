import { Table as HeroUITable } from "@heroui/react";
import type { ComponentProps, ReactNode } from "react";

export type TableProps = ComponentProps<typeof HeroUITable>;

function TableRoot(props: TableProps) {
  return <HeroUITable {...props} />;
}

export interface TableAdaptiveProps {
  /** View rendered on desktop/tablet (>= md / 768px). Typically a full <Table>. */
  desktop: ReactNode;
  /** View rendered on mobile (< md / 768px). Typically a compact list or stacked rows. */
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

/** HeroUI Table, re-exported with its compound parts and Table.Adaptive. */
export const Table = Object.assign(TableRoot, {
  ScrollContainer: HeroUITable.ScrollContainer,
  Content: HeroUITable.Content,
  Header: HeroUITable.Header,
  Column: HeroUITable.Column,
  Body: HeroUITable.Body,
  Row: HeroUITable.Row,
  Cell: HeroUITable.Cell,
  Adaptive: TableAdaptive,
});

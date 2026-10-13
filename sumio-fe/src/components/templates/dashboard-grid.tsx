import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface DashboardGridProps {
  children: ReactNode;
  /** Number of columns on desktop viewports (defaults to 2). */
  cols?: 2 | 3 | 4;
  className?: string;
}

const COLS_CLASSES: Record<2 | 3 | 4, string> = {
  2: "grid-cols-1 lg:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

/** Responsive grid container encapsulating internal screen-tier breakpoints. */
export function DashboardGrid({ children, cols = 2, className }: DashboardGridProps) {
  const colClass = COLS_CLASSES[cols];

  return <div className={cn("grid gap-5", colClass, className)}>{children}</div>;
}

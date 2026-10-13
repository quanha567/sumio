import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SplitLayoutProps {
  main: ReactNode;
  aside: ReactNode;
  /**
   * Split ratio on large screens:
   * - "default": 8/4 on lg, 9/3 on xl (standard master-detail, e.g. transactions)
   * - "wide": 7/5 on lg, 8/4 on xl (balanced master-detail, e.g. dashboard)
   * - "equal": 6/6 on lg (50/50 split)
   */
  ratio?: "default" | "wide" | "equal";
  className?: string;
  mainClassName?: string;
  asideClassName?: string;
}

/**
 * Encapsulated responsive two-column master-detail layout.
 * Enforces internal breakpoint handling so features don't author ad-hoc grid utilities.
 */
export function SplitLayout({
  main,
  aside,
  ratio = "default",
  className,
  mainClassName,
  asideClassName,
}: SplitLayoutProps) {
  const mainColClass =
    ratio === "wide"
      ? "lg:col-span-7 xl:col-span-8"
      : ratio === "equal"
        ? "lg:col-span-6"
        : "lg:col-span-8 xl:col-span-9";

  const asideColClass =
    ratio === "wide"
      ? "lg:col-span-5 xl:col-span-4"
      : ratio === "equal"
        ? "lg:col-span-6"
        : "lg:col-span-4 xl:col-span-3";

  return (
    <div className={cn("grid grid-cols-1 gap-6 lg:grid-cols-12", className)}>
      <div className={cn("min-w-0 space-y-4", mainColClass, mainClassName)}>{main}</div>

      <div className={cn("space-y-4", asideColClass, asideClassName)}>{aside}</div>
    </div>
  );
}

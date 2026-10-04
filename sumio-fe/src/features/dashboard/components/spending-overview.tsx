import { useState } from "react";

import { DonutChart, Metric, SectionCard, SelectPill, Text } from "@/components/ui";
import { formatCurrency } from "@/lib/format";

import type { SpendingCategory } from "../types";

const palette = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
];

const periods = [
  { id: "this-month", label: "This month" },
  { id: "last-month", label: "Last month" },
];

interface SpendingOverviewProps {
  categories: SpendingCategory[];
}

export function SpendingOverview({ categories }: SpendingOverviewProps) {
  const [period, setPeriod] = useState(periods[0].id);
  const total = categories.reduce((sum, c) => sum + c.amount, 0);
  const rows = categories.map((c, i) => ({
    ...c,
    color: palette[i % palette.length],
    percent: Math.round((c.amount / total) * 100),
  }));

  return (
    <SectionCard
      title="Spending Overview"
      description="Where your money goes this month"
      action={
        <SelectPill ariaLabel="Period" options={periods} value={period} onChange={setPeriod} />
      }
    >
      <div className="flex flex-col items-center gap-5 sm:flex-row">
        <DonutChart
          segments={rows.map((r) => ({ label: r.name, value: r.amount, color: r.color }))}
        >
          <Metric value={formatCurrency(total)} size="md" />
          <Text variant="caption" className="text-[10px]">
            Total spent
          </Text>
        </DonutChart>

        <ul className="w-full flex-1 space-y-2">
          {rows.map((r) => (
            <li key={r.name} className="flex items-center justify-between gap-2 text-xs">
              <span className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: r.color }}
                />
                <span className="text-foreground">{r.name}</span>
              </span>
              <span className="flex items-center gap-3">
                <span className="text-muted w-8 text-right tabular-nums">{r.percent}%</span>
                <span className="text-foreground w-16 text-right font-semibold tabular-nums">
                  {formatCurrency(r.amount)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </SectionCard>
  );
}

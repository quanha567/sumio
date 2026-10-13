import { formatMajorCurrencyAmount } from "@sumio/common";
import { useState } from "react";

import { ColorDot, Metric, SectionCard, SelectPill, Text } from "@/components/atoms";
import { DonutChart, EmptyState } from "@/components/molecules";

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
    percent: total > 0 ? Math.round((c.amount / total) * 100) : 0,
  }));

  return (
    <SectionCard
      title="Spending Overview"
      description="Where your money goes this month"
      action={
        <SelectPill ariaLabel="Period" options={periods} value={period} onChange={setPeriod} />
      }
    >
      {rows.length === 0 ? (
        <EmptyState
          title="No spending recorded"
          description="No expenses recorded for this period."
          variant="clean"
          className="py-8"
        />
      ) : (
        <div className="flex flex-col items-center gap-5 sm:flex-row">
          <DonutChart
            segments={rows.map((r) => ({ label: r.name, value: r.amount, color: r.color }))}
          >
            <Metric value={formatMajorCurrencyAmount(total)} size="md" />
            <Text variant="caption">Total spent</Text>
          </DonutChart>

          <ul className="w-full flex-1 space-y-2">
            {rows.map((r) => (
              <li key={r.name} className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <ColorDot color={r.color} />
                  <Text variant="body-sm">{r.name}</Text>
                </span>

                <span className="flex items-center gap-3">
                  <Text variant="muted" size="xs" className="w-8 text-right tabular-nums">
                    {r.percent}%
                  </Text>
                  <Text
                    variant="body-sm"
                    weight="semibold"
                    className="w-16 text-right tabular-nums"
                  >
                    {formatMajorCurrencyAmount(r.amount)}
                  </Text>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </SectionCard>
  );
}

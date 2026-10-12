import { ChevronRight } from "lucide-react";

import { DonutChart, type DonutSegment, EmptyState } from "@/components/common";
import { Card, Heading, Metric, Text } from "@/components/ui";
import { formatMoney } from "@/lib/format";

interface SummarySpendingCardProps {
  totalExpense: number;
  spendingSegments: DonutSegment[];
  currency: string;
  locale: string;
}

export function SummarySpendingCard({
  totalExpense,
  spendingSegments,
  currency,
  locale,
}: SummarySpendingCardProps) {
  return (
    <Card padding="md">
      <div className="flex items-center justify-between">
        <Heading level={3}>Spending by Category</Heading>
        <ChevronRight className="text-muted size-4" />
      </div>

      <div className="mt-4">
        {totalExpense === 0 || spendingSegments.length === 0 ? (
          <EmptyState
            title="No expenses recorded"
            description="No expenses recorded for this view."
            variant="clean"
            className="py-8"
          />
        ) : (
          <div className="flex flex-col items-center">
            <DonutChart segments={spendingSegments} size={150}>
              <div className="flex flex-col items-center">
                <Metric value={formatMoney(totalExpense, currency, locale)} size="sm" />
                <Text variant="caption">Total Expenses</Text>
              </div>
            </DonutChart>

            <div className="mt-4 w-full space-y-2.5">
              {spendingSegments.slice(0, 5).map((seg) => {
                const percent = totalExpense > 0 ? Math.round((seg.value / totalExpense) * 100) : 0;

                return (
                  <div key={seg.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: seg.color }}
                      />
                      <Text variant="body-sm" weight="medium" className="max-w-30 truncate">
                        {seg.label}
                      </Text>
                    </div>
                    <div className="flex items-center gap-3">
                      <Text variant="muted" size="xs" className="tabular-nums">
                        {percent}%
                      </Text>
                      <Text variant="body-sm" weight="semibold" className="tabular-nums">
                        {formatMoney(seg.value, currency, locale)}
                      </Text>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

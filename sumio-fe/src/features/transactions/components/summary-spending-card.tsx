import { ChevronRight } from "lucide-react";

import { formatCurrencyAmount } from "@sumio/common";

import { Button, Card, ColorDot, Heading, Metric, Text } from "@/components/atoms";
import { DonutChart, EmptyState, type DonutSegment } from "@/components/molecules";

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
}: SummarySpendingCardProps): React.JSX.Element {
  return (
    <Card padding="md">
      <div className="flex items-center justify-between">
        <Heading level={3}>Spending by Category</Heading>
        <Button isIconOnly variant="ghost" size="sm" aria-label="More category details">
          <ChevronRight className="h-4 w-4" />
        </Button>
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
                <Metric value={formatCurrencyAmount(totalExpense, currency, locale)} size="sm" />
                <Text variant="caption">Total Expenses</Text>
              </div>
            </DonutChart>

            <div className="mt-4 w-full space-y-2.5">
              {spendingSegments.slice(0, 5).map((seg) => {
                const percent = totalExpense > 0 ? Math.round((seg.value / totalExpense) * 100) : 0;

                return (
                  <div key={seg.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ColorDot color={seg.color} />
                      <Text variant="body-sm" weight="medium" className="max-w-30 truncate">
                        {seg.label}
                      </Text>
                    </div>

                    <div className="flex items-center gap-3">
                      <Text variant="muted" size="xs" className="tabular-nums">
                        {percent}%
                      </Text>
                      <Text variant="body-sm" weight="semibold" className="tabular-nums">
                        {formatCurrencyAmount(seg.value, currency, locale)}
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

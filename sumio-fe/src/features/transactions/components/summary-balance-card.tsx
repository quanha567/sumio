import { ArrowDownLeft, ArrowUpRight, MoreHorizontal } from "lucide-react";

import { IconBadge, Sparkline, TrendBadge } from "@/components/common";
import { Button, Card, Metric, Text } from "@/components/ui";
import { formatMoney } from "@/lib/format";

interface SummaryBalanceCardProps {
  netBalance: number;
  totalIncome: number;
  totalExpense: number;
  currency: string;
  locale: string;
  sparklineData: number[];
}

export function SummaryBalanceCard({
  netBalance,
  totalIncome,
  totalExpense,
  currency,
  locale,
  sparklineData,
}: SummaryBalanceCardProps) {
  return (
    <Card padding="md">
      <div className="flex items-center justify-between">
        <Text variant="caption" weight="semibold">
          This Month
        </Text>
        <Button isIconOnly variant="ghost" size="sm" aria-label="More options">
          <MoreHorizontal className="size-4" />
        </Button>
      </div>

      <div className="mt-3">
        <div>
          <Text variant="caption">Total balance</Text>
          <div className="mt-1 flex items-baseline justify-between">
            <Metric
              value={formatMoney(Math.abs(netBalance), currency, locale)}
              size="lg"
              tone={netBalance >= 0 ? "income" : "expense"}
            />
            <Sparkline
              data={sparklineData}
              color={netBalance >= 0 ? "var(--finance-income)" : "var(--finance-expense)"}
            />
          </div>
          <div className="mt-1">
            <TrendBadge
              delta={netBalance >= 0 ? "Surplus" : "Deficit"}
              direction={netBalance >= 0 ? "up" : "down"}
              tone={netBalance >= 0 ? "income" : "expense"}
            />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Card intent="secondary" padding="sm">
            <div className="flex items-center gap-2">
              <IconBadge icon={ArrowDownLeft} tone="income" size="sm" shape="circle" />
              <Text variant="caption" weight="medium">
                Income
              </Text>
            </div>
            <Metric
              value={formatMoney(totalIncome, currency, locale)}
              size="sm"
              className="mt-2 block"
            />
            <div className="mt-1">
              <TrendBadge delta="Recorded" direction="none" tone="income" />
            </div>
          </Card>

          <Card intent="secondary" padding="sm">
            <div className="flex items-center gap-2">
              <IconBadge icon={ArrowUpRight} tone="expense" size="sm" shape="circle" />
              <Text variant="caption" weight="medium">
                Expenses
              </Text>
            </div>
            <Metric
              value={formatMoney(totalExpense, currency, locale)}
              size="sm"
              className="mt-2 block"
            />
            <div className="mt-1">
              <TrendBadge delta="Recorded" direction="none" tone="expense" />
            </div>
          </Card>
        </div>
      </div>
    </Card>
  );
}

import { ArrowRight, PlusCircle } from "lucide-react";
import { useMemo } from "react";

import type { VoidFunction } from "@sumio/common";
import type { TransactionDto } from "@sumio/contract";

import { Button, Card, Heading, Text } from "@/components/atoms";
import { IconBadge, type DonutSegment } from "@/components/molecules";

import { SummaryBalanceCard } from "./summary-balance-card";
import { SummarySpendingCard } from "./summary-spending-card";
import { getCategoryMeta } from "./transaction-category-icon";

interface TransactionSummaryPanelProps {
  transactions: TransactionDto[];
  currency: string;
  locale: string;
  onAddIncome: VoidFunction;
  onAddExpense: VoidFunction;
}

export function TransactionSummaryPanel({
  transactions,
  currency,
  locale,
  onAddIncome,
  onAddExpense,
}: TransactionSummaryPanelProps): React.JSX.Element {
  const { totalIncome, totalExpense, netBalance, spendingSegments, sparklineData } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    const catMap = new Map<string, number>();

    const sorted = transactions.toSorted((a, b) => a.date.localeCompare(b.date));
    let runningBalance = 0;
    const spark: number[] = [];

    for (const tx of sorted) {
      if (tx.type === "income") {
        inc += tx.amount;
        runningBalance += tx.amount;
      } else {
        exp += tx.amount;
        runningBalance -= tx.amount;
        const prev = catMap.get(tx.category.name) ?? 0;

        catMap.set(tx.category.name, prev + tx.amount);
      }

      spark.push(runningBalance);
    }

    let segments: DonutSegment[] = [];

    if (exp > 0) {
      for (const [name, amount] of catMap.entries()) {
        const meta = getCategoryMeta(name, "expense");

        segments.push({
          label: name,
          value: amount,
          color: meta.chartColor,
        });
      }

      segments = segments.toSorted((a, b) => b.value - a.value);
    }

    const defaultSpark = [1200, 1500, 1400, 1900, 1800, 2200, 2450];

    return {
      totalIncome: inc,
      totalExpense: exp,
      netBalance: inc - exp,
      spendingSegments: segments,
      sparklineData: spark.length >= 2 ? spark : defaultSpark,
    };
  }, [transactions]);

  return (
    <div className="flex flex-col gap-5">
      <SummaryBalanceCard
        netBalance={netBalance}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        currency={currency}
        locale={locale}
        sparklineData={sparklineData}
      />

      <SummarySpendingCard
        totalExpense={totalExpense}
        spendingSegments={spendingSegments}
        currency={currency}
        locale={locale}
      />

      <SummaryQuickActions onAddIncome={onAddIncome} onAddExpense={onAddExpense} />
    </div>
  );
}

interface SummaryQuickActionsProps {
  onAddIncome: VoidFunction;
  onAddExpense: VoidFunction;
}

function SummaryQuickActions({
  onAddIncome,
  onAddExpense,
}: SummaryQuickActionsProps): React.JSX.Element {
  return (
    <Card padding="md">
      <Heading level={3}>Quick Actions</Heading>

      <div className="mt-3.5 space-y-2">
        <Button
          intent="outline"
          onPress={onAddIncome}
          className="h-auto w-full justify-between p-3 text-left"
        >
          <div className="flex items-center gap-3">
            <IconBadge icon={PlusCircle} tone="income" size="sm" />
            <div>
              <Text variant="label" className="block">
                Add Income
              </Text>
              <Text variant="caption">Salary, freelance, etc.</Text>
            </div>
          </div>

          <ArrowRight className="h-4 w-4 opacity-60" />
        </Button>

        <Button
          intent="outline"
          onPress={onAddExpense}
          className="h-auto w-full justify-between p-3 text-left"
        >
          <div className="flex items-center gap-3">
            <IconBadge icon={PlusCircle} tone="expense" size="sm" />
            <div>
              <Text variant="label" className="block">
                Add Expense
              </Text>
              <Text variant="caption">Food, shopping, transport...</Text>
            </div>
          </div>

          <ArrowRight className="h-4 w-4 opacity-60" />
        </Button>
      </div>
    </Card>
  );
}

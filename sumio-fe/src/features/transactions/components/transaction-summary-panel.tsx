import type { TransactionDto } from "@sumio/contract";
import { useMemo } from "react";

import type { DonutSegment } from "@/components/common";

import { SummaryBalanceCard } from "./summary-balance-card";
import { SummaryQuickActions } from "./summary-quick-actions";
import { SummarySpendingCard } from "./summary-spending-card";
import { getCategoryMeta } from "./transaction-category-icon";

interface TransactionSummaryPanelProps {
  transactions: TransactionDto[];
  currency: string;
  locale: string;
  onAddIncome: () => void;
  onAddExpense: () => void;
}

export function TransactionSummaryPanel({
  transactions,
  currency,
  locale,
  onAddIncome,
  onAddExpense,
}: TransactionSummaryPanelProps) {
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

import { PiggyBank, TrendingDown, TrendingUp, Wallet } from "lucide-react";

import { formatCurrencyAmount } from "@sumio/common";

import { Skeleton } from "@/components/atoms";
import { StatCard, type StatCardProps } from "@/components/molecules";

export interface KpiCardsProps {
  totalBalance?: number;
  monthlyIncome?: number;
  monthlyExpenses?: number;
  savingsRate?: string;
  currency?: string;
  locale?: string;
  isLoading?: boolean;
}

export function KpiCards({
  totalBalance = 0,
  monthlyIncome = 0,
  monthlyExpenses = 0,
  savingsRate = "0%",
  currency = "USD",
  locale = "en-US",
  isLoading,
}: KpiCardsProps = {}): React.JSX.Element {
  if (isLoading) {
    return (
      <StatCard.Grid>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </StatCard.Grid>
    );
  }

  const cards: StatCardProps[] = [
    {
      label: "Total Balance",
      value: formatCurrencyAmount(totalBalance, currency, locale),
      icon: Wallet,
      tone: totalBalance >= 0 ? "accent" : "danger",
      delta: "Live",
      deltaDirection: "none",
      deltaTone: "accent",
      hint: true,
    },
    {
      label: "Total Income",
      value: formatCurrencyAmount(monthlyIncome, currency, locale),
      icon: TrendingUp,
      tone: "income",
      delta: "Live",
      deltaDirection: "none",
      deltaTone: "income",
    },
    {
      label: "Total Expenses",
      value: formatCurrencyAmount(monthlyExpenses, currency, locale),
      icon: TrendingDown,
      tone: "expense",
      deltaTone: "expense",
      deltaDirection: "none",
      delta: "Live",
    },
    {
      label: "Savings Rate",
      value: savingsRate,
      icon: PiggyBank,
      tone: "sand",
      delta: "Live",
      deltaDirection: "none",
      deltaTone: "sand",
    },
  ];

  return (
    <StatCard.Grid>
      {cards.map((kpi, idx) => (
        <div
          key={kpi.label}
          className="animate-entrance"
          style={{ animationDelay: `${idx * 60}ms` }}
        >
          <StatCard {...kpi} />
        </div>
      ))}
    </StatCard.Grid>
  );
}

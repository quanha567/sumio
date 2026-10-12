import { PiggyBank, TrendingDown, TrendingUp, Wallet } from "lucide-react";

import { StatCard, type StatCardProps } from "@/components/common";
import { Skeleton } from "@/components/ui";
import { formatCurrency, formatMoney } from "@/lib/format";

export interface KpiCardsProps {
  totalBalance?: number;
  monthlyIncome?: number;
  monthlyExpenses?: number;
  savingsRate?: string;
  currency?: string;
  locale?: string;
  isLoading?: boolean;
}

const defaultKpis: StatCardProps[] = [
  {
    label: "Total Balance",
    value: formatCurrency(2845.5),
    icon: Wallet,
    tone: "success",
    delta: "12%",
    trend: [3, 4, 3.5, 5, 6, 6.5, 8],
    hint: true,
  },
  {
    label: "Monthly Income",
    value: formatCurrency(4500),
    icon: TrendingUp,
    tone: "success",
    delta: "8%",
    trend: [4, 4.5, 4.2, 5.5, 6, 7, 7.5],
  },
  {
    label: "Monthly Expenses",
    value: formatCurrency(2320.5),
    icon: TrendingDown,
    tone: "danger",
    delta: "5%",
    deltaTone: "danger",
    trend: [6, 5.5, 6.5, 6, 7, 7.2, 8],
  },
  {
    label: "Savings Rate",
    value: "27%",
    icon: PiggyBank,
    tone: "accent",
    delta: "6%",
    trend: [3, 3.5, 4, 5, 5.2, 6.5, 8],
  },
];

export function KpiCards({
  totalBalance,
  monthlyIncome,
  monthlyExpenses,
  savingsRate,
  currency = "USD",
  locale = "en-US",
  isLoading,
}: KpiCardsProps = {}) {
  if (isLoading) {
    return (
      <StatCard.Grid>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="rounded-card h-28 w-full" />
        ))}
      </StatCard.Grid>
    );
  }

  const hasLiveData = totalBalance !== undefined || monthlyIncome !== undefined;

  const cards: StatCardProps[] = hasLiveData
    ? [
        {
          label: "Total Balance",
          value: formatMoney(totalBalance ?? 0, currency, locale),
          icon: Wallet,
          tone: (totalBalance ?? 0) >= 0 ? "accent" : "danger",
          delta: "Live",
          deltaDirection: "none",
          deltaTone: "accent",
          trend: [3, 4, 3.5, 5, 6, 6.5, 8],
          hint: true,
        },
        {
          label: "Total Income",
          value: formatMoney(monthlyIncome ?? 0, currency, locale),
          icon: TrendingUp,
          tone: "income",
          delta: "Live",
          deltaDirection: "none",
          deltaTone: "income",
          trend: [4, 4.5, 4.2, 5.5, 6, 7, 7.5],
        },
        {
          label: "Total Expenses",
          value: formatMoney(monthlyExpenses ?? 0, currency, locale),
          icon: TrendingDown,
          tone: "expense",
          deltaTone: "expense",
          deltaDirection: "none",
          delta: "Live",
          trend: [6, 5.5, 6.5, 6, 7, 7.2, 8],
        },
        {
          label: "Savings Rate",
          value: savingsRate ?? "0%",
          icon: PiggyBank,
          tone: "sand",
          delta: "Live",
          deltaDirection: "none",
          deltaTone: "sand",
          trend: [3, 3.5, 4, 5, 5.2, 6.5, 8],
        },
      ]
    : defaultKpis;

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

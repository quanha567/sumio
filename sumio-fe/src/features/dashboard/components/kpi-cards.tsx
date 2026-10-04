import { PiggyBank, TrendingDown, TrendingUp, Wallet } from "lucide-react";

import { StatCard, type StatCardProps } from "@/components/ui";
import { formatCurrency } from "@/lib/format";

const kpis: StatCardProps[] = [
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

export function KpiCards() {
  return (
    <StatCard.Grid>
      {kpis.map((kpi, idx) => (
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

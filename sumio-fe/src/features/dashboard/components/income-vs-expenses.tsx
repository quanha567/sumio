import { useState } from "react";

import { GroupedBarChart, SectionCard, SelectPill, type BarSeries } from "@/components/ui";

import type { WeeklyCashflow } from "../types";

interface IncomeVsExpensesProps {
  data: WeeklyCashflow[];
}

const series: BarSeries[] = [
  { key: "income", name: "Income", color: "var(--chart-1)" },
  { key: "expenses", name: "Expenses", color: "var(--chart-4)" },
];

const ranges = [
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
];

const formatK = (v: number) => (v === 0 ? "0" : `${v / 1000}K`);

export function IncomeVsExpenses({ data }: IncomeVsExpensesProps) {
  const [range, setRange] = useState(ranges[0].id);

  return (
    <SectionCard
      title="Income vs Expenses"
      description="Last 4 weeks"
      action={
        <div className="flex items-center gap-3">
          <ul className="text-muted hidden items-center gap-3 text-xs sm:flex">
            {series.map((s) => (
              <li key={s.key} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                {s.name}
              </li>
            ))}
          </ul>
          <SelectPill ariaLabel="Range" options={ranges} value={range} onChange={setRange} />
        </div>
      }
    >
      <GroupedBarChart data={data} xKey="label" series={series} max={5000} formatValue={formatK} />
    </SectionCard>
  );
}

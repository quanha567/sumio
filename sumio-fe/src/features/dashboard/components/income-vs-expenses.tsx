import { useState } from "react";

import { ChartLegend, GroupedBarChart, type BarSeries } from "@/components/common";
import { SectionCard, SelectPill } from "@/components/ui";

import type { WeeklyCashflow } from "../types";

interface IncomeVsExpensesProps {
  data: WeeklyCashflow[];
}

const series: BarSeries[] = [
  { key: "income", name: "Income", color: "var(--finance-income)" },
  { key: "expenses", name: "Expenses", color: "var(--finance-expense)" },
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
          <ChartLegend series={series} />
          <SelectPill ariaLabel="Range" options={ranges} value={range} onChange={setRange} />
        </div>
      }
    >
      <GroupedBarChart data={data} xKey="label" series={series} max={5000} formatValue={formatK} />
    </SectionCard>
  );
}

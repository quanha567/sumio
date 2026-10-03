import { ChevronDown } from "lucide-react";

import { Card } from "@/components/ui";

interface WeeklyData {
  week: string;
  income: number;
  expenses: number;
}

const weeklyData: WeeklyData[] = [
  { week: "Apr 14", income: 2.3, expenses: 1.8 },
  { week: "Apr 21", income: 2.8, expenses: 1.9 },
  { week: "Apr 28", income: 3.2, expenses: 2.7 },
  { week: "May 5", income: 4.2, expenses: 3.4 },
];

export function IncomeExpenseChart() {
  const maxVal = 5;

  return (
    <Card className="flex flex-col justify-between p-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <h2 className="text-foreground text-base font-bold">Income vs Expenses</h2>

        <div className="flex items-center gap-3">
          {/* Legend */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="bg-success h-2.5 w-2.5 rounded-full" />
              <span className="text-muted">Income</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="bg-danger h-2.5 w-2.5 rounded-full" />
              <span className="text-muted">Expenses</span>
            </div>
          </div>

          <button
            type="button"
            className="border-border bg-surface-secondary text-foreground hover:bg-surface flex cursor-pointer items-center gap-1 rounded-xl border px-2.5 py-1 text-xs font-medium transition-colors"
          >
            <span>Last 4 weeks</span>
            <ChevronDown className="text-muted h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="mt-6 flex h-44 items-end gap-3 pt-4">
        {/* Y Axis Labels */}
        <div className="text-muted flex h-full flex-col justify-between pb-6 font-mono text-[10px]">
          <span>5K</span>
          <span>4K</span>
          <span>3K</span>
          <span>2K</span>
          <span>1K</span>
          <span>0</span>
        </div>

        {/* Bars Container */}
        <div className="border-border relative flex h-full flex-1 items-end justify-around border-b pb-2">
          {/* Horizontal Grid lines */}
          <div className="border-border/40 pointer-events-none absolute inset-x-0 top-0 border-b border-dashed" />
          <div className="border-border/40 pointer-events-none absolute inset-x-0 top-1/4 border-b border-dashed" />
          <div className="border-border/40 pointer-events-none absolute inset-x-0 top-2/4 border-b border-dashed" />
          <div className="border-border/40 pointer-events-none absolute inset-x-0 top-3/4 border-b border-dashed" />

          {weeklyData.map((item) => {
            const incomeHeight = `${(item.income / maxVal) * 100}%`;
            const expenseHeight = `${(item.expenses / maxVal) * 100}%`;

            return (
              <div key={item.week} className="group flex flex-col items-center gap-2">
                <div className="flex h-36 items-end gap-1.5">
                  {/* Income bar */}
                  <div
                    className="bg-success w-3 rounded-t-md transition-all duration-300 group-hover:opacity-90 sm:w-4"
                    style={{ height: incomeHeight }}
                    title={`Income: $${item.income * 1000}`}
                  />
                  {/* Expense bar */}
                  <div
                    className="bg-danger w-3 rounded-t-md transition-all duration-300 group-hover:opacity-90 sm:w-4"
                    style={{ height: expenseHeight }}
                    title={`Expenses: $${item.expenses * 1000}`}
                  />
                </div>
                <span className="text-muted font-mono text-[11px]">{item.week}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

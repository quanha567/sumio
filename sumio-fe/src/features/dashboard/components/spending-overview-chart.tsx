import { ChevronDown } from "lucide-react";

import { Card } from "@/components/ui";

interface SpendingCategory {
  name: string;
  percentage: number;
  amount: string;
  color: string;
}

const categories: SpendingCategory[] = [
  {
    name: "Food & Dining",
    percentage: 32,
    amount: "$ 560.00",
    color: "var(--danger)",
  },
  {
    name: "Shopping",
    percentage: 21,
    amount: "$ 368.00",
    color: "var(--warning)",
  },
  {
    name: "Transport",
    percentage: 15,
    amount: "$ 263.00",
    color: "var(--accent)",
  },
  {
    name: "Bills",
    percentage: 12,
    amount: "$ 210.00",
    color: "var(--success)",
  },
  {
    name: "Entertainment",
    percentage: 10,
    amount: "$ 175.00",
    color: "#a855f7",
  },
  { name: "Others", percentage: 10, amount: "$ 174.00", color: "var(--muted)" },
];

export function SpendingOverviewChart() {
  const radius = 64;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  return (
    <Card className="flex flex-col justify-between p-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-foreground text-base font-bold">
            Spending Overview
          </h2>
          <p className="text-muted text-xs">Where your money goes this month</p>
        </div>
        <button
          type="button"
          className="border-border bg-surface-secondary text-foreground hover:bg-surface flex cursor-pointer items-center gap-1 rounded-xl border px-2.5 py-1 text-xs font-medium transition-colors"
        >
          <span>This month</span>
          <ChevronDown className="text-muted h-3.5 w-3.5" />
        </button>
      </div>

      {/* Content: Donut + Legend */}
      <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row">
        {/* Donut Chart */}
        <div className="relative flex shrink-0 items-center justify-center">
          <svg
            width="160"
            height="160"
            viewBox="0 0 160 160"
            className="-rotate-90"
          >
            {categories.map((cat) => {
              const strokeDasharray = `${(cat.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -(
                (cumulativePercent / 100) *
                circumference
              );
              cumulativePercent += cat.percentage;

              return (
                <circle
                  key={cat.name}
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={cat.color}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300 hover:opacity-85"
                />
              );
            })}
          </svg>

          {/* Donut Center Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-foreground text-base font-extrabold">
              $ 1,750.00
            </span>
            <span className="text-muted text-[10px] font-medium">
              Total Expenses
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="w-full flex-1 space-y-2">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="hover:bg-surface-secondary/50 flex items-center justify-between rounded-sm py-0.5 text-xs transition-colors"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-foreground font-medium">{cat.name}</span>
              </div>
              <div className="flex items-center gap-4 text-right">
                <span className="text-muted font-mono">{cat.percentage}%</span>
                <span className="text-foreground w-16 font-semibold">
                  {cat.amount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

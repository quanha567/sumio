import { Car, ChevronRight, Gamepad2, ShoppingBag, Utensils } from "lucide-react";

import { Card, ProgressBar } from "@/components/ui";

interface BudgetItem {
  id: string;
  name: string;
  spent: number;
  total: number;
  icon: typeof Utensils;
  iconBg: string;
  iconColor: string;
}

const budgetItems: BudgetItem[] = [
  {
    id: "food",
    name: "Food & Dining",
    spent: 560,
    total: 800,
    icon: Utensils,
    iconBg: "bg-danger/15",
    iconColor: "text-danger",
  },
  {
    id: "shopping",
    name: "Shopping",
    spent: 368,
    total: 600,
    icon: ShoppingBag,
    iconBg: "bg-warning/15",
    iconColor: "text-warning",
  },
  {
    id: "transport",
    name: "Transport",
    spent: 263,
    total: 400,
    icon: Car,
    iconBg: "bg-accent/15",
    iconColor: "text-accent",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    spent: 175,
    total: 300,
    icon: Gamepad2,
    iconBg: "bg-surface-tertiary",
    iconColor: "text-foreground",
  },
];

export function BudgetsCard() {
  return (
    <Card className="flex flex-col justify-between p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-accent/15 text-accent flex h-8 w-8 items-center justify-center rounded-xl">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
          <div>
            <h2 className="text-foreground text-base font-bold">Budgets</h2>
            <p className="text-muted text-[11px]">Track your spending limits • Manual entry</p>
          </div>
        </div>

        <button
          type="button"
          className="text-accent flex cursor-pointer items-center gap-1 text-xs font-semibold hover:opacity-80"
        >
          <span>View all</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Grid of Budgets */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {budgetItems.map((item) => {
          const Icon = item.icon;
          const percentage = Math.round((item.spent / item.total) * 100);

          return (
            <div
              key={item.id}
              className="group border-border bg-surface-secondary hover:bg-surface flex cursor-pointer flex-col justify-between rounded-xl border p-3 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-xl ${item.iconBg} ${item.iconColor}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-foreground text-xs font-semibold">{item.name}</p>
                    <p className="text-muted text-[11px] font-medium">
                      <span className="text-foreground font-bold">${item.spent}</span> / $
                      {item.total}
                    </p>
                  </div>
                </div>
                <ChevronRight className="text-muted group-hover:text-accent h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>

              {/* Progress Bar */}
              <div className="mt-3 flex items-center gap-2">
                <ProgressBar
                  value={percentage}
                  aria-label={`${item.name} budget`}
                  className="bg-border h-1.5 flex-1"
                />
                <span className="text-muted text-[10px] font-semibold">{percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

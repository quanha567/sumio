import { HelpCircle, Target, TrendingDown, User, Wallet } from "lucide-react";

import { Card } from "@/components/ui";

interface MetricItem {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: "up" | "down";
  changeText: string;
  icon: typeof Wallet;
  iconBg: string;
  iconColor: string;
  sparklineColor: string;
  hasInfo?: boolean;
}

const metrics: MetricItem[] = [
  {
    id: "balance",
    title: "Total Balance",
    value: "$ 2,450.00",
    change: "↑ 12%",
    changeType: "up",
    changeText: "vs. last month",
    icon: Wallet,
    iconBg: "bg-success/15",
    iconColor: "text-success",
    sparklineColor: "var(--success)",
    hasInfo: true,
  },
  {
    id: "income",
    title: "Monthly Income",
    value: "$ 4,200.00",
    change: "↑ 8%",
    changeType: "up",
    changeText: "vs. last month",
    icon: User,
    iconBg: "bg-accent/15",
    iconColor: "text-accent",
    sparklineColor: "var(--accent)",
  },
  {
    id: "expenses",
    title: "Monthly Expenses",
    value: "$ 1,750.00",
    change: "↑ 5%",
    changeType: "down",
    changeText: "vs. last month",
    icon: TrendingDown,
    iconBg: "bg-danger/15",
    iconColor: "text-danger",
    sparklineColor: "var(--danger)",
  },
  {
    id: "savings-rate",
    title: "Savings Rate",
    value: "27%",
    change: "↑ 6%",
    changeType: "up",
    changeText: "vs. last month",
    icon: Target,
    iconBg: "bg-warning/15",
    iconColor: "text-warning",
    sparklineColor: "var(--warning)",
  },
];

export function MetricCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card
            key={metric.id}
            className="flex flex-col justify-between p-4.5 transition-all duration-200 hover:-translate-y-0.5"
          >
            {/* Header: Icon + Title */}
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${metric.iconBg} ${metric.iconColor}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted text-xs font-medium">{metric.title}</span>
                {metric.hasInfo && (
                  <HelpCircle className="text-muted/70 hover:text-foreground h-3 w-3" />
                )}
              </div>
            </div>

            {/* Value */}
            <div className="mt-3">
              <h2 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                {metric.value}
              </h2>
            </div>

            {/* Footer: Trend + Sparkline */}
            <div className="mt-3 flex items-end justify-between">
              <div className="flex items-center gap-1 text-[11px]">
                <span
                  className={`font-semibold ${
                    metric.changeType === "down" ? "text-danger" : "text-success"
                  }`}
                >
                  {metric.change}
                </span>
                <span className="text-muted">{metric.changeText}</span>
              </div>

              {/* Sparkline Wave */}
              <div className="h-6 w-16">
                <svg viewBox="0 0 64 24" className="h-full w-full overflow-visible">
                  <path
                    d={
                      metric.id === "expenses"
                        ? "M2 18 Q16 20 28 12 T48 10 T62 4"
                        : "M2 20 Q16 16 30 10 T46 8 T62 2"
                    }
                    fill="none"
                    stroke={metric.sparklineColor}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

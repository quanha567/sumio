import { ChevronRight, Laptop, LifeBuoy, Plane, Target } from "lucide-react";

import { Card, ProgressBar } from "@/components/ui";

interface GoalItem {
  id: string;
  name: string;
  saved: number;
  target: number;
  icon: typeof LifeBuoy;
  iconBg: string;
  iconColor: string;
}

const goals: GoalItem[] = [
  {
    id: "emergency",
    name: "Emergency Fund",
    saved: 800,
    target: 5000,
    icon: LifeBuoy,
    iconBg: "bg-success/15",
    iconColor: "text-success",
  },
  {
    id: "laptop",
    name: "New Laptop",
    saved: 600,
    target: 2000,
    icon: Laptop,
    iconBg: "bg-accent/15",
    iconColor: "text-accent",
  },
  {
    id: "bali",
    name: "Travel to Bali",
    saved: 1200,
    target: 3000,
    icon: Plane,
    iconBg: "bg-warning/15",
    iconColor: "text-warning",
  },
];

export function GoalsCard() {
  return (
    <Card className="flex flex-col justify-between p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-accent/15 text-accent flex h-8 w-8 items-center justify-center rounded-xl">
            <Target className="h-4 w-4" />
          </div>
          <h2 className="text-foreground text-base font-bold">Goals</h2>
        </div>

        <button
          type="button"
          className="text-accent flex cursor-pointer items-center gap-1 text-xs font-semibold hover:opacity-80"
        >
          <span>View all</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* List of Goals */}
      <div className="mt-4 space-y-3">
        {goals.map((goal) => {
          const Icon = goal.icon;
          const percentage = Math.round((goal.saved / goal.target) * 100);

          return (
            <div
              key={goal.id}
              className="group border-border bg-surface-secondary hover:bg-surface flex cursor-pointer flex-col justify-between rounded-xl border p-3 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-xl ${goal.iconBg} ${goal.iconColor}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-foreground text-xs font-semibold">{goal.name}</p>
                    <p className="text-muted text-[11px] font-medium">
                      <span className="text-foreground font-bold">
                        ${goal.saved.toLocaleString()}
                      </span>{" "}
                      / ${goal.target.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-muted text-xs font-bold">{percentage}%</span>
                  <ChevronRight className="text-muted group-hover:text-accent h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-2.5">
                <ProgressBar
                  value={percentage}
                  aria-label={`${goal.name} goal`}
                  className="bg-border h-1.5 w-full"
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

import { ArrowLeftRight, Plus, Receipt, Wallet } from "lucide-react";

import { Button, Card } from "@/components/ui";

interface ActionItem {
  id: string;
  title: string;
  subtitle: string;
  icon: typeof Wallet;
  iconBg: string;
  iconColor: string;
}

const actions: ActionItem[] = [
  {
    id: "income",
    title: "Add Income",
    subtitle: "Salary, freelance, etc.",
    icon: Wallet,
    iconBg: "bg-success/15",
    iconColor: "text-success",
  },
  {
    id: "expense",
    title: "Add Expense",
    subtitle: "Food, shopping, transport, etc.",
    icon: Receipt,
    iconBg: "bg-danger/15",
    iconColor: "text-danger",
  },
  {
    id: "transfer",
    title: "Add Transfer",
    subtitle: "Move money between accounts",
    icon: ArrowLeftRight,
    iconBg: "bg-accent/15",
    iconColor: "text-accent",
  },
];

export function QuickAddCard() {
  return (
    <Card className="p-5">
      <h2 className="text-foreground text-base font-bold">Quick Add</h2>

      <div className="mt-4 space-y-2.5">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <div
              key={act.id}
              className="group border-border bg-surface-secondary hover:bg-surface flex items-center justify-between rounded-xl border p-3 transition-all"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${act.iconBg} ${act.iconColor}`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-foreground text-xs font-semibold">{act.title}</p>
                  <p className="text-muted text-[11px]">{act.subtitle}</p>
                </div>
              </div>

              <Button
                variant="outline"
                className="border-border bg-surface text-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent h-7 w-7 rounded-lg p-0"
                aria-label={act.title}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

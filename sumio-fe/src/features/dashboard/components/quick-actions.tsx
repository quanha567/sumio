import { BarChart2, Plus, Target, Wallet, type LucideIcon } from "lucide-react";

import plant from "@/assets/illustrations/quick-actions-plant.jpg";
import { Button, IconBadge, SectionCard } from "@/components/ui";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const actions: QuickAction[] = [
  {
    id: "add-transaction",
    title: "Add Transaction",
    description: "Record your income or spending",
    icon: Plus,
  },
  { id: "set-budget", title: "Set Budget", description: "Plan your spending", icon: Wallet },
  { id: "add-goal", title: "Add Goal", description: "Save for what matters", icon: Target },
  {
    id: "view-reports",
    title: "View Reports",
    description: "Get detailed insights",
    icon: BarChart2,
  },
];

export function QuickActions() {
  return (
    <SectionCard title="Quick Actions">
      <div className="grid grid-cols-2 gap-3">
        {actions.map(({ id, title, description, icon }) => (
          <Button
            key={id}
            variant="outline"
            className="h-auto justify-start gap-3 rounded-xl p-3 text-left font-normal"
          >
            <IconBadge icon={icon} className="h-9 w-9 rounded-full" iconClassName="h-4 w-4" />
            <span className="min-w-0">
              <span className="text-foreground block text-xs font-semibold">{title}</span>
              <span className="text-muted block text-[11px] leading-tight whitespace-normal">
                {description}
              </span>
            </span>
          </Button>
        ))}
      </div>
      <div className="bg-surface-secondary mt-3 flex items-center gap-3 rounded-xl p-3">
        <img src={plant} alt="" className="h-12 w-12 rounded-lg object-cover" />
        <div>
          <p className="text-foreground text-xs font-semibold">You&apos;re doing great!</p>
          <p className="text-muted text-[11px]">Consistent habits build a better tomorrow.</p>
        </div>
      </div>
    </SectionCard>
  );
}

import { BarChart2, Plus, Sparkles, Target, Wallet, type LucideIcon } from "lucide-react";

import { IconBadge } from "@/components/common";
import { Button, Card, SectionCard, Text } from "@/components/ui";

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
          <Button key={id} intent="outline" className="h-auto justify-start gap-3 p-3 text-left">
            <IconBadge icon={icon} size="sm" shape="circle" />
            <span className="min-w-0">
              <Text variant="label" className="block truncate">
                {title}
              </Text>
              <Text variant="caption" className="block leading-tight whitespace-normal">
                {description}
              </Text>
            </span>
          </Button>
        ))}
      </div>
      <Card intent="secondary" padding="sm" className="mt-3">
        <div className="flex items-center gap-3">
          <IconBadge icon={Sparkles} tone="sand" />
          <div className="min-w-0">
            <Text variant="label">You&apos;re doing great!</Text>
            <Text variant="caption">Consistent habits build financial peace of mind.</Text>
          </div>
        </div>
      </Card>
    </SectionCard>
  );
}

import { Laptop } from "lucide-react";

import { IconBadge } from "@/components/common";
import { Card, Heading, ProgressLine, Text } from "@/components/ui";
import { formatCurrency } from "@/lib/format";

interface FinancialGoalCardProps {
  title: string;
  saved: number;
  target: number;
}

export function FinancialGoalCard({ title, saved, target }: FinancialGoalCardProps) {
  const percent = Math.min(100, Math.round((saved / target) * 100));

  return (
    <Card padding="md">
      <div className="flex items-center gap-3">
        <IconBadge icon={Laptop} tone="sand" />
        <div className="min-w-0">
          <Text variant="caption">Financial goal</Text>
          <Heading level={3} className="truncate">
            {title}
          </Heading>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between tabular-nums">
          <Text variant="caption">
            {formatCurrency(saved)} / {formatCurrency(target)}
          </Text>
          <Text variant="caption" weight="semibold">
            {percent}%
          </Text>
        </div>
        <ProgressLine value={percent} ariaLabel={title} color="sand" className="mt-1.5" />
      </div>
    </Card>
  );
}

import { Laptop } from "lucide-react";

import { Card, ProgressLine, Text } from "@/components/ui";
import { formatCurrency } from "@/lib/format";

interface FinancialGoalCardProps {
  title: string;
  saved: number;
  target: number;
}

export function FinancialGoalCard({ title, saved, target }: FinancialGoalCardProps) {
  const percent = Math.min(100, Math.round((saved / target) * 100));

  return (
    <Card className="bg-accent text-accent-foreground border-transparent p-4">
      <div className="flex items-center gap-3">
        <div className="bg-accent-foreground/15 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
          <Laptop className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <Text variant="caption" className="opacity-80">
            Financial goal
          </Text>
          <Text variant="body" className="font-semibold text-inherit">
            {title}
          </Text>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px] tabular-nums">
        <span>
          {formatCurrency(saved)} / {formatCurrency(target)}
        </span>
        <span className="font-semibold">{percent}%</span>
      </div>
      <ProgressLine
        value={percent}
        ariaLabel={title}
        className="mt-1.5"
        trackClassName="bg-accent-foreground/25"
        fillClassName="bg-accent-foreground"
      />
    </Card>
  );
}

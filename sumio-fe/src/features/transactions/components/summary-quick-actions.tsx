import { ArrowRight, PlusCircle } from "lucide-react";

import { IconBadge } from "@/components/common";
import { Button, Card, Heading, Text } from "@/components/ui";

interface SummaryQuickActionsProps {
  onAddIncome: () => void;
  onAddExpense: () => void;
}

export function SummaryQuickActions({ onAddIncome, onAddExpense }: SummaryQuickActionsProps) {
  return (
    <Card padding="md">
      <Heading level={3}>Quick Actions</Heading>

      <div className="mt-3.5 space-y-2">
        <Button
          intent="outline"
          onPress={onAddIncome}
          className="h-auto w-full justify-between p-3 text-left"
        >
          <div className="flex items-center gap-3">
            <IconBadge icon={PlusCircle} tone="income" size="sm" />
            <div>
              <Text variant="label" className="block">
                Add Income
              </Text>
              <Text variant="caption">Salary, freelance, etc.</Text>
            </div>
          </div>
          <ArrowRight className="text-muted size-4" />
        </Button>

        <Button
          intent="outline"
          onPress={onAddExpense}
          className="h-auto w-full justify-between p-3 text-left"
        >
          <div className="flex items-center gap-3">
            <IconBadge icon={PlusCircle} tone="expense" size="sm" />
            <div>
              <Text variant="label" className="block">
                Add Expense
              </Text>
              <Text variant="caption">Food, shopping, transport...</Text>
            </div>
          </div>
          <ArrowRight className="text-muted size-4" />
        </Button>
      </div>
    </Card>
  );
}

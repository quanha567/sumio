import { IconBadge, Metric, SectionCard, SectionLink, Text } from "@/components/ui";
import { formatCurrency } from "@/lib/format";

import type { UpcomingBill } from "../types";

interface UpcomingBillsProps {
  bills: UpcomingBill[];
}

export function UpcomingBills({ bills }: UpcomingBillsProps) {
  return (
    <SectionCard title="Upcoming Bills" action={<SectionLink label="View all" />}>
      <ul className="space-y-3">
        {bills.map((bill) => (
          <li key={bill.id} className="flex items-center gap-3">
            <IconBadge icon={bill.icon} className="h-9 w-9 rounded-full" iconClassName="h-4 w-4" />
            <div className="min-w-0 flex-1">
              <Text variant="body" className="text-xs font-semibold">
                {bill.name}
              </Text>
              <Text variant="caption">{bill.dueLabel}</Text>
            </div>
            <Metric
              value={formatCurrency(bill.amount)}
              size="sm"
              className="text-xs font-semibold"
            />
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}

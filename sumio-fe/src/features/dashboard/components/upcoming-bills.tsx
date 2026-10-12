import { EmptyState, IconBadge } from "@/components/common";
import { Metric, SectionCard, SectionLink, Text } from "@/components/ui";
import { formatCurrency } from "@/lib/format";

import type { UpcomingBill } from "../types";

interface UpcomingBillsProps {
  bills: UpcomingBill[];
}

export function UpcomingBills({ bills }: UpcomingBillsProps) {
  return (
    <SectionCard title="Upcoming Bills" action={<SectionLink label="View all" />}>
      {bills.length === 0 ? (
        <EmptyState title="No upcoming bills" variant="clean" className="py-6" />
      ) : (
        <ul className="space-y-3">
          {bills.map((bill) => (
            <li key={bill.id} className="flex items-center gap-3">
              <IconBadge icon={bill.icon} size="sm" shape="circle" tone="neutral" />
              <div className="min-w-0 flex-1">
                <Text variant="label">{bill.name}</Text>
                <Text variant="caption">{bill.dueLabel}</Text>
              </div>
              <Metric value={formatCurrency(bill.amount)} size="sm" />
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}

import { IconBadge, Metric, SectionCard, SectionLink, Text } from "@/components/ui";
import { formatSignedCurrency } from "@/lib/format";

import type { Transaction } from "../types";

interface TransactionsListProps {
  transactions: Transaction[];
  limit?: number;
}

export function TransactionsList({ transactions, limit = 4 }: TransactionsListProps) {
  return (
    <SectionCard title="Recent Transactions" action={<SectionLink label="View all" />}>
      <ul className="space-y-3">
        {transactions.slice(0, limit).map((t) => (
          <li key={t.id} className="flex items-center gap-3">
            <IconBadge
              icon={t.icon}
              tone={t.type === "income" ? "success" : "accent"}
              className="h-9 w-9 rounded-full"
              iconClassName="h-4 w-4"
            />
            <div className="min-w-0 flex-1">
              <Text variant="body" className="truncate text-xs font-semibold">
                {t.description}
              </Text>
              <Text variant="caption">{t.category}</Text>
            </div>
            <div className="text-right">
              <Metric
                value={formatSignedCurrency(t.amount)}
                size="sm"
                tone={t.type === "income" ? "success" : "danger"}
                className="block text-xs font-semibold"
              />
              <Text variant="caption" className="tabular-nums">
                {t.date}
              </Text>
            </div>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}

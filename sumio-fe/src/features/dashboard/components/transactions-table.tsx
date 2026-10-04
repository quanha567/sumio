import { useState } from "react";

import {
  Chip,
  IconBadge,
  Metric,
  SearchField,
  SectionCard,
  SectionLink,
  SegmentedTabs,
  Table,
  Text,
} from "@/components/ui";
import { formatSignedCurrency } from "@/lib/format";

import type { Transaction, TransactionType } from "../types";

type Filter = "all" | TransactionType;

const tabs: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "income", label: "Income" },
  { id: "expense", label: "Expense" },
];

const columns = ["Date", "Description", "Category", "Amount", "Type"];

function TransactionRow({ t }: { t: Transaction }) {
  const isIncome = t.type === "income";
  return (
    <Table.Row id={t.id}>
      <Table.Cell className="text-muted whitespace-nowrap tabular-nums">{t.date}</Table.Cell>
      <Table.Cell>
        <span className="flex items-center gap-2">
          <IconBadge
            icon={t.icon}
            tone={isIncome ? "success" : "accent"}
            className="h-7 w-7 rounded-full"
            iconClassName="h-3.5 w-3.5"
          />
          <Text variant="body" as="span" className="font-medium">
            {t.description}
          </Text>
        </span>
      </Table.Cell>
      <Table.Cell className="text-muted">{t.category}</Table.Cell>
      <Table.Cell>
        <Metric
          value={formatSignedCurrency(t.amount)}
          size="sm"
          tone={isIncome ? "success" : "danger"}
        />
      </Table.Cell>
      <Table.Cell>
        <Chip size="sm" variant="soft" color={isIncome ? "success" : "danger"}>
          {isIncome ? "Income" : "Expense"}
        </Chip>
      </Table.Cell>
    </Table.Row>
  );
}

function MobileTransactionItem({ t }: { t: Transaction }) {
  const isIncome = t.type === "income";
  return (
    <li className="border-border/60 flex items-center gap-3 border-b py-2.5 last:border-0">
      <IconBadge
        icon={t.icon}
        tone={isIncome ? "success" : "accent"}
        className="h-8 w-8 rounded-full"
        iconClassName="h-4 w-4"
      />
      <div className="min-w-0 flex-1">
        <Text variant="body" className="truncate text-xs font-semibold">
          {t.description}
        </Text>
        <Text variant="caption">
          {t.category} • <span className="tabular-nums">{t.date}</span>
        </Text>
      </div>
      <div className="text-right">
        <Metric
          value={formatSignedCurrency(t.amount)}
          size="sm"
          tone={isIncome ? "success" : "danger"}
          className="block text-xs font-semibold"
        />
        <Chip
          size="sm"
          variant="soft"
          color={isIncome ? "success" : "danger"}
          className="mt-0.5 px-1.5 py-0 text-[10px]"
        >
          {isIncome ? "Income" : "Expense"}
        </Chip>
      </div>
    </li>
  );
}

interface TransactionsTableProps {
  transactions: Transaction[];
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const rows = transactions.filter(
    (t) =>
      (filter === "all" || t.type === filter) &&
      `${t.description} ${t.category}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <SectionCard title="Recent Transactions" action={<SectionLink label="View all" />}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <SegmentedTabs
          ariaLabel="Transaction type"
          tabs={tabs}
          value={filter}
          onChange={setFilter}
        />
        <SearchField aria-label="Search transactions" value={query} onChange={setQuery}>
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input className="w-28" placeholder="Search" />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>
      </div>

      <Table.Adaptive
        desktop={
          <Table variant="secondary">
            <Table.ScrollContainer>
              <Table.Content aria-label="Recent transactions" className="min-w-[520px]">
                <Table.Header>
                  {columns.map((c, i) => (
                    <Table.Column key={c} isRowHeader={i === 1}>
                      {c}
                    </Table.Column>
                  ))}
                </Table.Header>
                <Table.Body
                  renderEmptyState={() => (
                    <Text variant="muted" className="py-6 text-center text-xs">
                      No transactions found
                    </Text>
                  )}
                >
                  {rows.map((t) => (
                    <TransactionRow key={t.id} t={t} />
                  ))}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        }
        mobile={
          rows.length === 0 ? (
            <Text variant="muted" className="py-6 text-center text-xs">
              No transactions found
            </Text>
          ) : (
            <ul className="divide-border/40 divide-y">
              {rows.map((t) => (
                <MobileTransactionItem key={t.id} t={t} />
              ))}
            </ul>
          )
        }
      />
    </SectionCard>
  );
}

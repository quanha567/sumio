import { formatSignedMajorCurrencyAmount } from "@sumio/common";
import { useNavigate } from "@tanstack/react-router";
import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import { useState } from "react";

import {
  Chip,
  Metric,
  SearchField,
  SectionCard,
  SectionLink,
  SegmentedTabs,
  Text,
} from "@/components/atoms";
import { DataTable, EmptyState, IconBadge } from "@/components/molecules";

import type { Transaction, TransactionType } from "../types";

type Filter = "all" | TransactionType;

const tabs: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "income", label: "Income" },
  { id: "expense", label: "Expense" },
];

const columns: ColumnDef<TableFeatures, Transaction>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ getValue }) => (
      <Text variant="muted" size="xs" className="whitespace-nowrap tabular-nums">
        {getValue() as string}
      </Text>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const t = row.original;
      const isIncome = t.type === "income";

      return (
        <span className="flex items-center gap-2.5">
          <IconBadge
            icon={t.icon}
            tone={isIncome ? "income" : "neutral"}
            size="sm"
            shape="circle"
          />
          <Text variant="body" as="span" weight="medium">
            {t.description}
          </Text>
        </span>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ getValue }) => (
      <Text variant="muted" size="xs">
        {getValue() as string}
      </Text>
    ),
  },
  {
    accessorKey: "amount",
    header: () => (
      <Text variant="label" className="block text-right">
        Amount
      </Text>
    ),
    cell: ({ row }) => {
      const t = row.original;
      const isIncome = t.type === "income";

      return (
        <div className="text-right">
          <Metric
            value={formatSignedMajorCurrencyAmount(t.amount)}
            size="sm"
            trend={isIncome ? "income" : "expense"}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: () => (
      <Text variant="label" className="block text-center">
        Type
      </Text>
    ),
    cell: ({ row }) => {
      const isIncome = row.original.type === "income";

      return (
        <div className="text-center">
          <Chip intent={isIncome ? "income" : "expense"}>{isIncome ? "Income" : "Expense"}</Chip>
        </div>
      );
    },
  },
];

function MobileTransactionItem(t: Transaction) {
  const isIncome = t.type === "income";

  return (
    <div className="flex items-center gap-3 py-2.5">
      <IconBadge icon={t.icon} tone={isIncome ? "income" : "neutral"} size="sm" shape="circle" />
      <div className="min-w-0 flex-1">
        <Text variant="label" className="truncate">
          {t.description}
        </Text>
        <Text variant="caption">
          {t.category} • <span className="tabular-nums">{t.date}</span>
        </Text>
      </div>
      <div className="text-right">
        <Metric
          value={formatSignedMajorCurrencyAmount(t.amount)}
          size="sm"
          trend={isIncome ? "income" : "expense"}
          className="block"
        />
        <Chip intent={isIncome ? "income" : "expense"} className="mt-0.5">
          {isIncome ? "Income" : "Expense"}
        </Chip>
      </div>
    </div>
  );
}

interface TransactionsTableProps {
  transactions: Transaction[];
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const rows = transactions.filter(
    (t) =>
      (filter === "all" || t.type === filter) &&
      `${t.description} ${t.category}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <SectionCard
      title="Recent Transactions"
      action={
        <SectionLink
          label="View all"
          onPress={() =>
            void navigate({
              to: "/transactions",
              search: {
                page: 1,
                type: "all",
                categoryId: "all",
                date: "all",
                q: "",
              },
            })
          }
        />
      }
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <SegmentedTabs
          ariaLabel="Transaction type"
          tabs={tabs}
          value={filter}
          onChange={setFilter}
        />
        <SearchField aria-label="Search transactions" value={query} onChange={setQuery}>
          <SearchField.Group className="w-32 sm:w-40">
            <SearchField.SearchIcon />
            <SearchField.Input placeholder="Search" />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>
      </div>

      <DataTable
        data={rows}
        columns={columns}
        renderMobileRow={(item) => MobileTransactionItem(item)}
        emptyState={<EmptyState title="No transactions found" variant="clean" className="py-6" />}
        ariaLabel="Recent transactions"
      />
    </SectionCard>
  );
}

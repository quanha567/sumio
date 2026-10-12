import type { TransactionDto } from "@sumio/contract";
import type { ColumnDef } from "@tanstack/react-table";
import { AlertCircle, Edit2, MoreVertical, RefreshCw, Trash2 } from "lucide-react";
import { useMemo } from "react";

import { DataTable, EmptyState } from "@/components/common";
import {
  Alert,
  Button,
  Checkbox,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownPopover,
  DropdownTrigger,
  Metric,
  Spinner,
  Text,
} from "@/components/ui";
import { formatMoney } from "@/lib/format";

import { CategoryIcon } from "./transaction-category-icon";
import { TransactionTableMobileRow } from "./transaction-table-mobile-row";
import { TransactionTableSkeleton } from "./transaction-table-skeleton";

interface TransactionTableViewProps {
  transactions: TransactionDto[];
  isLoading: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  selectedIds: Set<string>;
  baseCurrency: string;
  userLocale: string;
  onToggleSelectAll: (isSelected: boolean) => void;
  onToggleSelectRow: (id: string, isSelected: boolean) => void;
  onEdit: (tx: TransactionDto) => void;
  onDelete: (tx: TransactionDto) => void;
}

export function TransactionTableView({
  transactions,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  selectedIds,
  baseCurrency,
  userLocale,
  onToggleSelectAll,
  onToggleSelectRow,
  onEdit,
  onDelete,
}: TransactionTableViewProps) {
  const isAllSelected = transactions.length > 0 && transactions.every((t) => selectedIds.has(t.id));

  const columns = useMemo<ColumnDef<any, TransactionDto>[]>(
    () => [
      {
        id: "select",
        header: () => (
          <Checkbox
            slot="selection"
            isSelected={isAllSelected}
            onChange={onToggleSelectAll}
            aria-label="Select all transactions"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            slot="selection"
            isSelected={selectedIds.has(row.original.id)}
            onChange={(sel) => onToggleSelectRow(row.original.id, sel)}
            aria-label={`Select ${row.original.description}`}
          />
        ),
      },
      {
        id: "date",
        header: "Date",
        accessorKey: "date",
        cell: ({ row }) => {
          const rawDate = row.original.date;
          let formatted = rawDate;
          if (rawDate) {
            try {
              const parts = rawDate.split("-").map(Number);
              if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
                const d = new Date(parts[0], parts[1] - 1, parts[2]);
                formatted = new Intl.DateTimeFormat(userLocale, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }).format(d);
              }
            } catch {
              // fallback
            }
          }
          return (
            <Text variant="muted" size="xs" className="whitespace-nowrap tabular-nums">
              {formatted}
            </Text>
          );
        },
      },
      {
        id: "description",
        header: "Description",
        accessorKey: "description",
        cell: ({ row }) => {
          const t = row.original;
          return (
            <div className="flex min-w-0 items-center gap-3">
              <CategoryIcon categoryName={t.category.name} type={t.type} size="md" />
              <Text variant="body" weight="semibold" className="truncate">
                {t.description || "Untitled Transaction"}
              </Text>
            </div>
          );
        },
      },
      {
        id: "category",
        header: "Category",
        cell: ({ row }) => (
          <Chip intent="secondary" className="max-w-37.5 truncate">
            <span className="bg-accent size-1.5 shrink-0 rounded-full" />
            <span className="truncate">{row.original.category.name}</span>
          </Chip>
        ),
      },
      {
        id: "amount",
        header: () => <span className="block text-right">Amount</span>,
        cell: ({ row }) => {
          const t = row.original;
          const isIncome = t.type === "income";
          return (
            <div className="text-right">
              <Metric
                value={`${isIncome ? "+ " : "- "}${formatMoney(t.amount, t.currency || baseCurrency, userLocale)}`}
                tone={isIncome ? "income" : "expense"}
                size="sm"
              />
            </div>
          );
        },
      },
      {
        id: "actions",
        header: () => null,
        cell: ({ row }) => {
          const t = row.original;
          return (
            <div className="text-right">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly variant="ghost" size="sm" aria-label="Row actions">
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownTrigger>
                <DropdownPopover className="min-w-36">
                  <DropdownMenu
                    onAction={(key) => {
                      if (key === "edit") onEdit(t);
                      if (key === "delete") onDelete(t);
                    }}
                  >
                    <DropdownItem id="edit" textValue="Edit">
                      <Edit2 className="mr-2 size-3.5" />
                      Edit
                    </DropdownItem>
                    <DropdownItem id="delete" textValue="Delete" className="text-danger">
                      <Trash2 className="mr-2 size-3.5" />
                      Delete
                    </DropdownItem>
                  </DropdownMenu>
                </DropdownPopover>
              </Dropdown>
            </div>
          );
        },
      },
    ],
    [
      baseCurrency,
      isAllSelected,
      onDelete,
      onEdit,
      onToggleSelectAll,
      onToggleSelectRow,
      selectedIds,
      userLocale,
    ],
  );

  if (isError) {
    return (
      <div className="p-4">
        <Alert intent="danger" className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Alert.Indicator>
              <AlertCircle className="size-5" />
            </Alert.Indicator>
            <Alert.Content>
              <Alert.Title>Không thể tải danh sách giao dịch</Alert.Title>
              <Alert.Description>
                {errorMessage || "Đã xảy ra lỗi khi kết nối máy chủ."}
              </Alert.Description>
            </Alert.Content>
          </div>
          {onRetry && (
            <Button
              size="sm"
              intent="outline"
              onPress={onRetry}
              isDisabled={isLoading}
              className="gap-1.5"
            >
              {isLoading ? <Spinner size="sm" /> : <RefreshCw className="size-3.5" />}
              Thử lại
            </Button>
          )}
        </Alert>
      </div>
    );
  }

  if (isLoading && transactions.length === 0) {
    return <TransactionTableSkeleton />;
  }

  return (
    <DataTable
      data={transactions}
      columns={columns}
      renderMobileRow={(item) => (
        <TransactionTableMobileRow
          key={item.id}
          transaction={item}
          isSelected={selectedIds.has(item.id)}
          baseCurrency={baseCurrency}
          userLocale={userLocale}
          onToggleSelect={(sel) => onToggleSelectRow(item.id, sel)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
      emptyState={
        <EmptyState
          title="No transactions found"
          description="Try adjusting your filters or add a new transaction."
          variant="clean"
          className="py-16"
        />
      }
      ariaLabel="Transactions table"
    />
  );
}

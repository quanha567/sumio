import type { TransactionDto } from "@sumio/contract";
import { AlertCircle, Edit2, RefreshCw, Trash2 } from "lucide-react";
import { useMemo } from "react";

import { Alert, Button, Checkbox, Metric, Skeleton, Spinner, Text } from "@/components/atoms";
import { DataTable, EmptyState } from "@/components/molecules";
import { formatMoney } from "@/lib/format";

import { CategoryIcon } from "./transaction-category-icon";

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

import { buildTransactionColumns } from "./transaction-table-columns";

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

  const columns = useMemo(
    () =>
      buildTransactionColumns({
        isAllSelected,
        onToggleSelectAll,
        selectedIds,
        onToggleSelectRow,
        userLocale,
        baseCurrency,
        onEdit,
        onDelete,
      }),
    [
      isAllSelected,
      onToggleSelectAll,
      selectedIds,
      onToggleSelectRow,
      userLocale,
      baseCurrency,
      onEdit,
      onDelete,
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

function TransactionTableSkeleton() {
  return (
    <div className="space-y-4 p-5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center justify-between gap-4 py-2">
          <div className="flex items-center gap-3">
            <Skeleton className="size-4" />
            <Skeleton className="size-8" shape="circle" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-16" shape="pill" />
            <Skeleton className="size-7" shape="circle" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface TransactionTableMobileRowProps {
  transaction: TransactionDto;
  isSelected: boolean;
  baseCurrency: string;
  userLocale: string;
  onToggleSelect: (isSelected: boolean) => void;
  onEdit: (tx: TransactionDto) => void;
  onDelete: (tx: TransactionDto) => void;
}

function TransactionTableMobileRow({
  transaction: t,
  isSelected,
  baseCurrency,
  userLocale,
  onToggleSelect,
  onEdit,
  onDelete,
}: TransactionTableMobileRowProps) {
  const isIncome = t.type === "income";

  return (
    <DataTable.MobileRow isSelected={isSelected}>
      <Checkbox
        isSelected={isSelected}
        onChange={onToggleSelect}
        aria-label={`Select ${t.description}`}
      />
      <CategoryIcon categoryName={t.category.name} type={t.type} size="md" />
      <div className="min-w-0 flex-1">
        <Text variant="label" className="block truncate">
          {t.description || "Untitled Transaction"}
        </Text>
        <Text variant="caption" className="block">
          {t.category.name} • <span className="tabular-nums">{t.date}</span>
        </Text>
      </div>
      <div className="text-right">
        <Metric
          value={`${isIncome ? "+ " : "- "}${formatMoney(t.amount, t.currency || baseCurrency, userLocale)}`}
          tone={isIncome ? "income" : "expense"}
          size="sm"
          className="block"
        />
        <div className="mt-1 flex items-center justify-end gap-1">
          <Button isIconOnly intent="ghost" size="sm" onPress={() => onEdit(t)} aria-label="Edit">
            <Edit2 className="size-3.5" />
          </Button>
          <Button
            isIconOnly
            intent="ghost"
            color="danger"
            size="sm"
            onPress={() => onDelete(t)}
            aria-label="Delete"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>
    </DataTable.MobileRow>
  );
}

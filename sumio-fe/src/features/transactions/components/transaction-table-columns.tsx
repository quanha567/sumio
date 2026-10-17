import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import { Edit2, MoreVertical, Trash2 } from "lucide-react";

import { formatCurrencyAmount, formatDisplayDate, type OnChange } from "@sumio/common";
import type { TransactionDto } from "@sumio/contract";

import {
  Button,
  Checkbox,
  Chip,
  ColorDot,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownPopover,
  DropdownTrigger,
  Metric,
  Text,
} from "@/components/atoms";

import { CategoryIcon } from "./transaction-category-icon";

export interface TransactionColumnOptions {
  isAllSelected: boolean;
  onToggleSelectAll: OnChange<boolean>;
  selectedIds: Set<string>;
  onToggleSelectRow: OnChange<[id: string, isSelected: boolean]>;
  userLocale: string;
  baseCurrency: string;
  onEdit: OnChange<TransactionDto>;
  onDelete: OnChange<TransactionDto>;
}

interface SelectColumnOptions {
  isAllSelected: boolean;
  onToggleSelectAll: OnChange<boolean>;
  selectedIds: Set<string>;
  onToggleSelectRow: OnChange<[id: string, isSelected: boolean]>;
}

function createSelectColumn(opts: SelectColumnOptions): ColumnDef<TableFeatures, TransactionDto> {
  const { isAllSelected, onToggleSelectAll, selectedIds, onToggleSelectRow } = opts;

  return {
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
        aria-label={`Select ${row.original.description || "transaction"}`}
      />
    ),
  };
}

function createDateColumn(): ColumnDef<TableFeatures, TransactionDto> {
  return {
    id: "date",
    header: "Date",
    accessorKey: "date",
    cell: ({ row }) => (
      <Text variant="muted" size="xs" className="whitespace-nowrap tabular-nums">
        {formatDisplayDate(row.original.date)}
      </Text>
    ),
  };
}

function createDescriptionColumn(): ColumnDef<TableFeatures, TransactionDto> {
  return {
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
  };
}

function createCategoryColumn(): ColumnDef<TableFeatures, TransactionDto> {
  return {
    id: "category",
    header: "Category",
    cell: ({ row }) => (
      <Chip intent="secondary" className="max-w-37.5 truncate">
        <ColorDot tone="accent" size="xs" />
        <span className="truncate">{row.original.category.name}</span>
      </Chip>
    ),
  };
}

function createAmountColumn(
  baseCurrency: string,
  userLocale: string,
): ColumnDef<TableFeatures, TransactionDto> {
  return {
    id: "amount",
    header: () => (
      <Text variant="label" className="block text-right">
        Amount
      </Text>
    ),
    cell: ({ row }) => {
      const t = row.original;
      const isIncome = t.type === "income";
      const sign = isIncome ? "+ " : "- ";
      const formatted = formatCurrencyAmount(t.amount, t.currency || baseCurrency, userLocale);

      return (
        <div className="text-right">
          <Metric value={`${sign}${formatted}`} tone={isIncome ? "income" : "expense"} size="sm" />
        </div>
      );
    },
  };
}

function createActionsColumn(
  onEdit: OnChange<TransactionDto>,
  onDelete: OnChange<TransactionDto>,
): ColumnDef<TableFeatures, TransactionDto> {
  return {
    id: "actions",
    header: () => null,
    cell: ({ row }) => {
      const t = row.original;

      return (
        <div className="text-right">
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="ghost" size="sm" aria-label="Row actions">
                <MoreVertical className="h-4 w-4" />
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
                  <Edit2 className="mr-2 h-3.5 w-3.5" />
                  Edit
                </DropdownItem>
                <DropdownItem id="delete" textValue="Delete" intent="destructive">
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </DropdownPopover>
          </Dropdown>
        </div>
      );
    },
  };
}

export function buildTransactionColumns(
  opts: TransactionColumnOptions,
): ColumnDef<TableFeatures, TransactionDto>[] {
  return [
    createSelectColumn(opts),
    createDateColumn(),
    createDescriptionColumn(),

    createCategoryColumn(),
    createAmountColumn(opts.baseCurrency, opts.userLocale),
    createActionsColumn(opts.onEdit, opts.onDelete),
  ];
}

import type { TransactionDto } from "@sumio/contract";
import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import { Edit2, MoreVertical, Trash2 } from "lucide-react";

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
import { formatMoney } from "@/lib/format";

import { CategoryIcon } from "./transaction-category-icon";

export interface TransactionColumnOptions {
  isAllSelected: boolean;
  onToggleSelectAll: (isSelected: boolean) => void;
  selectedIds: Set<string>;
  onToggleSelectRow: (id: string, isSelected: boolean) => void;
  userLocale: string;
  baseCurrency: string;
  onEdit: (tx: TransactionDto) => void;
  onDelete: (tx: TransactionDto) => void;
}

function formatTransactionDate(rawDate: string, locale: string): string {
  try {
    const parts = rawDate.split("-").map(Number);
    if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(d);
    }
  } catch {
    // fallback
  }
  return rawDate;
}

export function buildTransactionColumns(
  opts: TransactionColumnOptions,
): ColumnDef<TableFeatures, TransactionDto>[] {
  const {
    isAllSelected,
    onToggleSelectAll,
    selectedIds,
    onToggleSelectRow,
    userLocale,
    baseCurrency,
    onEdit,
    onDelete,
  } = opts;

  return [
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
      cell: ({ row }) => (
        <Text variant="muted" size="xs" className="whitespace-nowrap tabular-nums">
          {formatTransactionDate(row.original.date, userLocale)}
        </Text>
      ),
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
          <ColorDot tone="accent" size="xs" />
          <span className="truncate">{row.original.category.name}</span>
        </Chip>
      ),
    },
    {
      id: "amount",
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
  ];
}

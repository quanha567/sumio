import type { TransactionDto } from "@sumio/contract";
import { Edit2, Trash2 } from "lucide-react";

import { Button, Checkbox, cn, Metric, Text } from "@/components/ui";
import { formatMoney } from "@/lib/format";

import { CategoryIcon } from "./transaction-category-icon";

interface TransactionTableMobileRowProps {
  transaction: TransactionDto;
  isSelected: boolean;
  baseCurrency: string;
  userLocale: string;
  onToggleSelect: (isSelected: boolean) => void;
  onEdit: (tx: TransactionDto) => void;
  onDelete: (tx: TransactionDto) => void;
}

export function TransactionTableMobileRow({
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
    <li
      className={cn(
        "flex items-center gap-3 py-3.5 transition-colors",
        isSelected && "bg-accent-subtle/50",
      )}
    >
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
            size="sm"
            onPress={() => onDelete(t)}
            aria-label="Delete"
          >
            <Trash2 className="text-danger size-3.5" />
          </Button>
        </div>
      </div>
    </li>
  );
}

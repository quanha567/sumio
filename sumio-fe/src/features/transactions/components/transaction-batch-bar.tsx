import { Trash2, X } from "lucide-react";

import { Button, Separator, Text, Toolbar } from "@/components/ui";

interface TransactionBatchBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBatchDelete?: () => void;
  onDeleteSelected?: () => void;
  isDeleting?: boolean;
}

export function TransactionBatchBar({
  selectedCount,
  onClearSelection,
  onBatchDelete,
  onDeleteSelected,
  isDeleting,
}: TransactionBatchBarProps) {
  if (selectedCount === 0) return null;

  const handleDelete = onBatchDelete || onDeleteSelected;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 fixed bottom-6 left-1/2 z-40 -translate-x-1/2 transform duration-200">
      <Toolbar
        aria-label="Batch actions"
        className="border-border bg-foreground text-background flex items-center gap-3 rounded-full border px-4 py-2 shadow-xl backdrop-blur-md"
      >
        <Text variant="caption" weight="medium" className="text-inherit tabular-nums">
          <Text as="span" weight="bold" className="text-finance-income">
            {selectedCount}
          </Text>{" "}
          selected
        </Text>

        <Separator orientation="vertical" className="bg-background/25 h-4" />

        <Button
          size="sm"
          intent="danger"
          className="gap-1.5"
          onPress={handleDelete}
          isDisabled={isDeleting}
        >
          <Trash2 className="size-3.5" />
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>

        <Button
          size="sm"
          intent="ghost"
          isIconOnly
          onPress={onClearSelection}
          aria-label="Clear selection"
        >
          <X className="size-3.5" />
        </Button>
      </Toolbar>
    </div>
  );
}

import { Trash2, X } from "lucide-react";
import type { ReactNode } from "react";

import { Button, Separator, Text, Toolbar } from "@/components/ui";

export interface BatchActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
  deleteLabel?: string;
  children?: ReactNode;
}

/**
 * Standard floating batch action bar for table/card bulk operations.
 * Encapsulates floating backdrop-blur styling, counter, and actions.
 */
export function BatchActionBar({
  selectedCount,
  onClearSelection,
  onDelete,
  isDeleting,
  deleteLabel = "Delete",
  children,
}: BatchActionBarProps) {
  if (selectedCount === 0) return null;

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

        {children}

        {onDelete && (
          <>
            <Separator orientation="vertical" className="bg-background/25 h-4" />

            <Button
              size="sm"
              intent="danger"
              className="gap-1.5"
              onPress={onDelete}
              isDisabled={isDeleting}
            >
              <Trash2 className="size-3.5" />
              {isDeleting ? "Deleting..." : deleteLabel}
            </Button>
          </>
        )}

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

import { useCallback, useState } from "react";

export interface TransactionSelectionResult {
  selectedIds: Set<string>;
  toggleSelectAll: (isSelected: boolean) => void;
  toggleSelectRow: (id: string, isSelected: boolean) => void;
  clearSelection: () => void;
}

export function useTransactionSelection(
  currentItems: Array<{ id: string }> = [],
): TransactionSelectionResult {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelectAll = useCallback(
    (isSelected: boolean) => {
      if (isSelected) {
        setSelectedIds(new Set(currentItems.map((item) => item.id)));
      } else {
        setSelectedIds(new Set());
      }
    },
    [currentItems],
  );

  const toggleSelectRow = useCallback((id: string, isSelected: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (isSelected) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  return {
    selectedIds,
    toggleSelectAll,
    toggleSelectRow,
    clearSelection,
  };
}

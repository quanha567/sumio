import { formatSignedCurrencyAmount } from "@sumio/common";
import type { AsyncVoidFunction, Nullable, OnChange, VoidFunction } from "@sumio/common";
import type { TransactionDto } from "@sumio/contract";

import { Card, Metric, Text } from "@/components/atoms";
import { ConfirmModal } from "@/components/molecules";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose?: VoidFunction;
  onOpenChange?: OnChange<boolean>;
  transaction: Nullable<TransactionDto>;
  onConfirm: AsyncVoidFunction;
  isDeleting?: boolean;
  baseCurrency?: string;
  userLocale?: string;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onOpenChange,
  transaction,
  onConfirm,
  isDeleting,
}: DeleteConfirmModalProps): React.JSX.Element | null {
  if (!transaction) return null;

  const handleClose = () => {
    if (onOpenChange) onOpenChange(false);
    if (onClose) onClose();
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={onConfirm}
      isLoading={isDeleting}
      title="Delete Transaction"
      description="Are you sure you want to permanently delete this transaction? This action cannot be undone."
      confirmText="Delete Permanently"
      confirmIntent="danger"
    >
      <Card intent="secondary" padding="sm">
        <div className="flex items-center justify-between">
          <Text variant="body" weight="semibold">
            {transaction.description || "Untitled Transaction"}
          </Text>
          <Metric
            value={formatSignedCurrencyAmount(
              transaction.amount,
              transaction.type,
              transaction.currency,
            )}
            size="sm"
            tone={transaction.type === "income" ? "income" : "expense"}
          />
        </div>
        <Text variant="muted" size="xs" className="mt-1">
          {transaction.category.name} • {transaction.date}
        </Text>
      </Card>
    </ConfirmModal>
  );
}

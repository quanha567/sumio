import type { CategoryDto, TransactionDto } from "@sumio/contract";

import { Alert, Button, Form, Modal } from "@/components/ui";

import { useTransactionFormModal } from "../hooks/use-transaction-form-modal";
import { TransactionFormFields } from "./transaction-form-fields";

interface TransactionFormModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  categories: CategoryDto[];
  baseCurrency: string;
  transactionToEdit?: TransactionDto | null;
  editingTransaction?: TransactionDto | null;
  defaultType?: "income" | "expense";
  isSaving?: boolean;
  onSubmit?: (data: {
    type: "income" | "expense";
    // minor units
    amount: number;
    date: string;
    description: string;
    categoryId: string;
  }) => Promise<void>;
  onSave?: (data: {
    type: "income" | "expense";
    // minor units
    amount: number;
    date: string;
    description: string;
    categoryId: string;
  }) => Promise<void>;
}

export function TransactionFormModal({
  isOpen,
  onClose,
  onOpenChange,
  categories,
  baseCurrency,
  transactionToEdit,
  editingTransaction,
  defaultType = "expense",
  isSaving = false,
  onSubmit,
  onSave,
}: TransactionFormModalProps) {
  const effectiveTx = editingTransaction ?? transactionToEdit;
  const isEditing = Boolean(effectiveTx);

  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) onOpenChange(open);
    if (!open && onClose) onClose();
  };

  const {
    form,
    selectedType,
    handleTypeChange,
    filteredCategories,
    isSubmitting,
    serverError,
    onFormSubmit,
  } = useTransactionFormModal({
    categories,
    baseCurrency,
    effectiveTx,
    defaultType,
    isOpen,
    onSuccess: () => handleOpenChange(false),
    handleSubmitAction: onSave ?? onSubmit,
  });

  const displayCurrency = effectiveTx ? effectiveTx.currency : baseCurrency;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      title={isEditing ? "Edit Transaction" : "New Transaction"}
    >
      <Form form={form} onSubmit={onFormSubmit} className="space-y-4">
        {serverError && (
          <Alert intent="danger">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Description>{serverError}</Alert.Description>
            </Alert.Content>
          </Alert>
        )}

        <TransactionFormFields
          selectedType={selectedType}
          onTypeChange={handleTypeChange}
          currency={displayCurrency}
          filteredCategories={filteredCategories}
        />

        <Modal.Footer>
          <Button
            type="button"
            intent="ghost"
            onPress={() => handleOpenChange(false)}
            isDisabled={isSubmitting || isSaving}
          >
            Cancel
          </Button>
          <Button type="submit" intent="primary" isDisabled={isSubmitting || isSaving}>
            {isSubmitting || isSaving ? "Saving..." : isEditing ? "Update" : "Create Transaction"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

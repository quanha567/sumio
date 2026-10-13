import type { CategoryDto, TransactionDto } from "@sumio/contract";

import {
  Alert,
  Button,
  Form,
  Modal,
  SegmentedTabs,
  SelectField,
  Text,
  TextField,
} from "@/components/ui";

import { useTransactionFormModal } from "../hooks/use-transaction-form-modal";

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

        <div>
          <Text variant="caption" className="mb-1.5 block">
            Transaction Type
          </Text>
          <SegmentedTabs
            ariaLabel="Transaction Type"
            tabs={[
              { id: "expense", label: "Expense" },
              { id: "income", label: "Income" },
            ]}
            value={selectedType}
            onChange={handleTypeChange}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            name="amount"
            type="number"
            step="any"
            min="0"
            placeholder="0.00"
            isRequired
            label={`Amount (${displayCurrency})`}
            rules={{
              required: "Valid amount is required",
              min: { value: 0.0001, message: "Valid amount is required" },
              valueAsNumber: true,
            }}
          />

          <TextField
            name="date"
            type="date"
            isRequired
            label="Date"
            rules={{ required: "Date is required" }}
          />
        </div>

        <SelectField
          name="categoryId"
          label="Category"
          isRequired
          placeholder={
            filteredCategories.length === 0 ? "No categories available" : "Select a category"
          }
          options={filteredCategories.map((c) => ({ id: c.id, label: c.name }))}
        />

        <TextField
          name="description"
          label="Description"
          placeholder="e.g. Grocery shopping, Lunch, Monthly salary"
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

import type { CategoryDto } from "@sumio/contract";

import type { useTransactionModals } from "../hooks";
import { DeleteConfirmModal } from "./delete-confirm-modal";
import { TransactionFormModal } from "./transaction-form-modal";

interface TransactionModalsProps {
  modals: ReturnType<typeof useTransactionModals>;
  categories: CategoryDto[];
  baseCurrency: string;
  userLocale: string;
}

export function TransactionModals({
  modals,
  categories,
  baseCurrency,
  userLocale,
}: TransactionModalsProps) {
  const {
    isFormOpen,
    formDefaultType,
    editingTx,
    isDeleteOpen,
    deletingTx,
    closeForm,
    closeDelete,
    handleSave,
    handleConfirmDelete,
    isSaving,
    isDeleting,
  } = modals;

  return (
    <>
      <TransactionFormModal
        isOpen={isFormOpen}
        onClose={closeForm}
        categories={categories}
        defaultType={formDefaultType}
        editingTransaction={editingTx}
        onSave={handleSave}
        baseCurrency={baseCurrency}
        isSaving={isSaving}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={closeDelete}
        transaction={deletingTx}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        baseCurrency={baseCurrency}
        userLocale={userLocale}
      />
    </>
  );
}

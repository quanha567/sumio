import type { CreateTransactionDto, TransactionDto, UpdateTransactionDto } from "@sumio/contract";
import { useCallback, useState } from "react";

import {
  useCreateTransactionMutation,
  useDeleteTransactionMutation,
  useUpdateTransactionMutation,
} from "../api/transaction-queries";

export interface TransactionModalsResult {
  isFormOpen: boolean;
  formDefaultType: "income" | "expense";
  editingTx: TransactionDto | null;
  isDeleteOpen: boolean;
  deletingTx: TransactionDto | null;
  openCreate: (defaultType?: "income" | "expense") => void;
  openEdit: (tx: TransactionDto) => void;
  closeForm: () => void;
  openDelete: (tx: TransactionDto) => void;
  closeDelete: () => void;
  handleSave: (dto: CreateTransactionDto | UpdateTransactionDto) => Promise<void>;
  handleConfirmDelete: () => Promise<void>;
  isSaving: boolean;
  isDeleting: boolean;
}

export function useTransactionModals(): TransactionModalsResult {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formDefaultType, setFormDefaultType] = useState<"income" | "expense">("expense");
  const [editingTx, setEditingTx] = useState<TransactionDto | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingTx, setDeletingTx] = useState<TransactionDto | null>(null);

  const createMutation = useCreateTransactionMutation();
  const updateMutation = useUpdateTransactionMutation();
  const deleteMutation = useDeleteTransactionMutation();

  const openCreate = useCallback((defaultType: "income" | "expense" = "expense") => {
    setEditingTx(null);
    setFormDefaultType(defaultType);
    setIsFormOpen(true);
  }, []);

  const openEdit = useCallback((tx: TransactionDto) => {
    setEditingTx(tx);
    setFormDefaultType(tx.type);
    setIsFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingTx(null);
  }, []);

  const openDelete = useCallback((tx: TransactionDto) => {
    setDeletingTx(tx);
    setIsDeleteOpen(true);
  }, []);

  const closeDelete = useCallback(() => {
    setIsDeleteOpen(false);
    setDeletingTx(null);
  }, []);

  const handleSave = useCallback(
    async (dto: CreateTransactionDto | UpdateTransactionDto) => {
      if (editingTx) {
        await updateMutation.mutateAsync({ id: editingTx.id, dto });
      } else {
        await createMutation.mutateAsync(dto as CreateTransactionDto);
      }
      closeForm();
    },
    [editingTx, updateMutation, createMutation, closeForm],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingTx) return;
    await deleteMutation.mutateAsync(deletingTx.id);
    closeDelete();
  }, [deletingTx, deleteMutation, closeDelete]);

  return {
    isFormOpen,
    formDefaultType,
    editingTx,
    isDeleteOpen,
    deletingTx,

    openCreate,
    openEdit,
    closeForm,
    openDelete,
    closeDelete,

    handleSave,
    handleConfirmDelete,

    isSaving: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

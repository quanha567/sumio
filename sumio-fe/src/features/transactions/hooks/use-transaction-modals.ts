import { useCallback, useState } from "react";

import type {
  AsyncCallback,
  AsyncVoidFunction,
  Nullable,
  OnChange,
  VoidFunction,
} from "@sumio/common";
import type {
  CreateTransactionDto,
  TransactionDto,
  TransactionType,
  UpdateTransactionDto,
} from "@sumio/contract";

import {
  useCreateTransactionMutation,
  useDeleteTransactionMutation,
  useUpdateTransactionMutation,
} from "../api/transaction-queries";

export interface TransactionModalsResult {
  isFormOpen: boolean;
  formDefaultType: TransactionType;
  editingTx: Nullable<TransactionDto>;
  isDeleteOpen: boolean;
  deletingTx: Nullable<TransactionDto>;
  openCreate: (defaultType?: TransactionType) => void;
  openEdit: OnChange<TransactionDto>;
  closeForm: VoidFunction;
  openDelete: OnChange<TransactionDto>;
  closeDelete: VoidFunction;
  handleSave: AsyncCallback<[dto: CreateTransactionDto | UpdateTransactionDto]>;
  handleConfirmDelete: AsyncVoidFunction;
  isSaving: boolean;
  isDeleting: boolean;
}

export function useTransactionModals(): TransactionModalsResult {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formDefaultType, setFormDefaultType] = useState<TransactionType>("expense");
  const [editingTx, setEditingTx] = useState<Nullable<TransactionDto>>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingTx, setDeletingTx] = useState<Nullable<TransactionDto>>(null);

  const createMutation = useCreateTransactionMutation();
  const updateMutation = useUpdateTransactionMutation();
  const deleteMutation = useDeleteTransactionMutation();

  const openCreate = useCallback((defaultType: TransactionType = "expense") => {
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

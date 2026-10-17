import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";

import {
  todayDateString,
  toMajorUnits,
  toMinorUnits,
  type AsyncCallback,
  type Nullable,
  type OnChange,
  type VoidFunction,
} from "@sumio/common";
import type { CategoryDto, TransactionDto, TransactionType } from "@sumio/contract";

export interface TransactionFormData {
  type: TransactionType;
  amount: number;
  date: string;
  description: string;
  categoryId: string;
}

export type TransactionSubmitPayload = {
  type: TransactionType;
  amount: number;
  date: string;
  description: string;
  categoryId: string;
};

export interface UseTransactionFormModalProps {
  categories: CategoryDto[];
  baseCurrency: string;
  effectiveTx?: Nullable<TransactionDto>;
  defaultType?: TransactionType;
  isOpen: boolean;
  onSuccess?: VoidFunction;
  onSubmitAction?: AsyncCallback<[payload: TransactionSubmitPayload]>;
  handleSubmitAction?: AsyncCallback<[payload: TransactionSubmitPayload]>;
}

export interface TransactionFormModalResult {
  form: UseFormReturn<TransactionFormData>;
  selectedType: TransactionType;
  handleTypeChange: OnChange<TransactionType>;
  filteredCategories: CategoryDto[];
  isSubmitting: boolean;
  serverError: Nullable<string>;
  onFormSubmit: (data: TransactionFormData) => Promise<void>;
  handleSubmit: (data: TransactionFormData) => Promise<void>;
}

export function useTransactionFormModal({
  categories,
  baseCurrency,
  effectiveTx,
  defaultType = "expense",
  isOpen,
  onSuccess,
  onSubmitAction,
  handleSubmitAction,
}: UseTransactionFormModalProps): TransactionFormModalResult {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<Nullable<string>>(null);

  const initialValues = useMemo<TransactionFormData>(() => {
    if (effectiveTx) {
      return {
        type: effectiveTx.type,
        amount: toMajorUnits(effectiveTx.amount, effectiveTx.currency),
        date: effectiveTx.date,
        description: effectiveTx.description,
        categoryId: effectiveTx.category.id,
      };
    }

    const initialType = defaultType || "expense";
    const defaultCat = categories.find((c) => c.type === initialType)?.id || "";

    return {
      type: initialType,
      amount: "" as unknown as number,
      date: todayDateString(),
      description: "",
      categoryId: defaultCat,
    };
  }, [effectiveTx, defaultType, categories]);

  const form = useForm<TransactionFormData>({
    values: isOpen ? initialValues : undefined,
    defaultValues: initialValues,
  });

  const { register, setValue, watch } = form;
  const selectedType = watch("type") || defaultType;

  const filteredCategories = categories.filter((c) => c.type === selectedType);

  const handleTypeChange = (newType: TransactionType) => {
    setValue("type", newType);
    const firstCat = categories.find((c) => c.type === newType)?.id || "";

    setValue("categoryId", firstCat);
  };

  useEffect(() => {
    if (isOpen) {
      setServerError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    register("categoryId", { required: true });
  }, [register]);

  const onFormSubmit = async (data: TransactionFormData) => {
    try {
      setIsSubmitting(true);
      setServerError(null);
      const currency = effectiveTx ? effectiveTx.currency : baseCurrency;
      const minorAmount = Number(toMinorUnits(Number(data.amount), currency));

      if (minorAmount <= 0) {
        setServerError("Amount must be greater than 0");
        setIsSubmitting(false);

        return;
      }

      if (!data.categoryId) {
        setServerError("Please select a category");
        setIsSubmitting(false);

        return;
      }

      const submitAction = onSubmitAction ?? handleSubmitAction;

      if (submitAction) {
        await submitAction({
          type: data.type,
          amount: minorAmount,
          date: data.date,
          description: data.description.trim(),
          categoryId: data.categoryId,
        });
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Failed to save transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    selectedType,
    handleTypeChange,
    filteredCategories,
    isSubmitting,
    serverError,
    onFormSubmit,
    handleSubmit: onFormSubmit,
  };
}

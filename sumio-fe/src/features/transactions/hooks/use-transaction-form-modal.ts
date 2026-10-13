import type { CategoryDto, TransactionDto } from "@sumio/contract";
import { useEffect, useMemo, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";

import { majorUnitsToMinor, minorUnitsToMajor } from "@/lib/format";

export interface TransactionFormData {
  type: "income" | "expense";
  amount: number;
  date: string;
  description: string;
  categoryId: string;
}

export interface UseTransactionFormModalProps {
  categories: CategoryDto[];
  baseCurrency: string;
  effectiveTx?: TransactionDto | null;
  defaultType?: "income" | "expense";
  isOpen: boolean;
  onSuccess?: () => void;
  handleSubmitAction?: (data: {
    type: "income" | "expense";
    // minor units
    amount: number;
    date: string;
    description: string;
    categoryId: string;
  }) => Promise<void>;
}

export interface TransactionFormModalResult {
  form: UseFormReturn<TransactionFormData>;
  selectedType: "income" | "expense";
  handleTypeChange: (newType: "income" | "expense") => void;
  filteredCategories: CategoryDto[];
  isSubmitting: boolean;
  serverError: string | null;
  onFormSubmit: (data: TransactionFormData) => Promise<void>;
}

function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useTransactionFormModal({
  categories,
  baseCurrency,
  effectiveTx,
  defaultType = "expense",
  isOpen,
  onSuccess,
  handleSubmitAction,
}: UseTransactionFormModalProps): TransactionFormModalResult {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const initialValues = useMemo<TransactionFormData>(() => {
    if (effectiveTx) {
      return {
        type: effectiveTx.type,
        amount: minorUnitsToMajor(effectiveTx.amount, effectiveTx.currency),
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
      date: getTodayString(),
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

  const handleTypeChange = (newType: "income" | "expense") => {
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
      const minorAmount = majorUnitsToMinor(Number(data.amount), currency);

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

      if (handleSubmitAction) {
        await handleSubmitAction({
          type: data.type,
          amount: minorAmount,
          date: data.date,
          description: data.description.trim(),
          categoryId: data.categoryId,
        });
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Failed to save transaction");
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
  };
}

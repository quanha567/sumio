import type { Nullable } from "@sumio/common";
import type { CategoryDto, TransactionDto } from "@sumio/contract";
import { useCallback } from "react";

import {
  useBatchDeleteTransactionsMutation,
  useCategoriesQuery,
  useTransactionsQuery,
} from "../api/transaction-queries";
import type { TransactionFiltersResult } from "./use-transaction-filters";
import { PAGE_SIZE, useTransactionFilters } from "./use-transaction-filters";
import type { TransactionSelectionResult } from "./use-transaction-selection";
import { useTransactionSelection } from "./use-transaction-selection";

export { PAGE_SIZE };

export interface TransactionListController
  extends TransactionFiltersResult, TransactionSelectionResult {
  transactions: TransactionDto[];
  total: number;
  page: number;
  pageSize: number;
  isPending: boolean;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Nullable<Error>;
  refetch: () => void;
  categories: CategoryDto[];
  isCategoriesPending: boolean;
  isCategoriesLoading: boolean;
  handleBatchDelete: () => Promise<void>;
  isBatchDeleting: boolean;
}

export function useTransactionList(): TransactionListController {
  const filters = useTransactionFilters();
  const transactionsQuery = useTransactionsQuery(filters.queryParams);
  const categoriesQuery = useCategoriesQuery();
  const batchDeleteMutation = useBatchDeleteTransactionsMutation();

  const items = transactionsQuery.data?.items ?? [];
  const selection = useTransactionSelection(items);

  const handleBatchDelete = useCallback(async () => {
    if (selection.selectedIds.size === 0) return;
    await batchDeleteMutation.mutateAsync(Array.from(selection.selectedIds));
    selection.clearSelection();
  }, [selection, batchDeleteMutation]);

  return {
    ...filters,

    // Data queries
    transactions: items,
    total: transactionsQuery.data?.total ?? 0,
    page: filters.search.page,
    pageSize: PAGE_SIZE,
    isPending: transactionsQuery.isPending,
    isLoading: transactionsQuery.isPending,
    isFetching: transactionsQuery.isFetching,
    isError: transactionsQuery.isError,
    error: transactionsQuery.error,
    refetch: transactionsQuery.refetch,

    categories: categoriesQuery.data?.items ?? [],
    isCategoriesPending: categoriesQuery.isPending,
    isCategoriesLoading: categoriesQuery.isPending,

    // Selection & batch actions
    ...selection,
    handleBatchDelete,
    isBatchDeleting: batchDeleteMutation.isPending,
  };
}

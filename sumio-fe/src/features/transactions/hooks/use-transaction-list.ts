import { useCallback } from "react";

import {
  useBatchDeleteTransactionsMutation,
  useCategoriesQuery,
  useTransactionsQuery,
} from "../api/transaction-queries";
import { PAGE_SIZE, useTransactionFilters } from "./use-transaction-filters";
import { useTransactionSelection } from "./use-transaction-selection";

export { PAGE_SIZE };

export function useTransactionList() {
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
    isLoading: transactionsQuery.isLoading,
    isFetching: transactionsQuery.isFetching,
    isError: transactionsQuery.isError,
    error: transactionsQuery.error,
    refetch: transactionsQuery.refetch,

    categories: categoriesQuery.data?.items ?? [],
    isCategoriesLoading: categoriesQuery.isLoading,

    // Selection & batch actions
    ...selection,
    handleBatchDelete,
    isBatchDeleting: batchDeleteMutation.isPending,
  };
}

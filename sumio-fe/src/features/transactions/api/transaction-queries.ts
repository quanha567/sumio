import type {
  CategoryListDto,
  CreateTransactionDto,
  ListTransactionsQuery,
  TransactionDto,
  TransactionListDto,
  UpdateTransactionDto,
} from "@sumio/contract";
import { skipToken, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/atoms";
import { useAuth } from "@/features/auth";

import {
  createTransactionApi,
  deleteTransactionApi,
  fetchCategories,
  fetchTransactions,
  updateTransactionApi,
} from "./transaction-api";

export const transactionKeys = {
  all: ["transactions"] as const,
  lists: () => [...transactionKeys.all, "list"] as const,
  list: (query: Partial<ListTransactionsQuery>) => [...transactionKeys.lists(), query] as const,
  details: () => [...transactionKeys.all, "detail"] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
};

export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
};

export function useTransactionsQuery(query: Partial<ListTransactionsQuery> = {}) {
  const { token } = useAuth();

  return useQuery<TransactionListDto, Error>({
    queryKey: transactionKeys.list(query),
    queryFn: token ? () => fetchTransactions(token, query) : skipToken,
  });
}

export function useCategoriesQuery() {
  const { token } = useAuth();

  return useQuery<CategoryListDto, Error>({
    queryKey: categoryKeys.all,
    queryFn: token ? () => fetchCategories(token) : skipToken,
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateTransactionMutation() {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation<TransactionDto, Error, CreateTransactionDto>({
    mutationFn: (dto) => {
      if (!token) throw new Error("Chưa đăng nhập");
      return createTransactionApi(token, dto);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      toast("Đã ghi nhận giao dịch thành công");
    },
    onError: (err) => {
      toast(err.message || "Không thể tạo giao dịch");
    },
  });
}

export function useUpdateTransactionMutation() {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation<TransactionDto, Error, { id: string; dto: UpdateTransactionDto }>({
    mutationFn: ({ id, dto }) => {
      if (!token) throw new Error("Chưa đăng nhập");
      return updateTransactionApi(token, id, dto);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      toast("Đã cập nhật giao dịch thành công");
    },
    onError: (err) => {
      toast(err.message || "Không thể cập nhật giao dịch");
    },
  });
}

export function useDeleteTransactionMutation() {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation<void, Error, string>({
    mutationFn: (id) => {
      if (!token) throw new Error("Chưa đăng nhập");
      return deleteTransactionApi(token, id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      toast("Đã xóa giao dịch thành công");
    },
    onError: (err) => {
      toast(err.message || "Không thể xóa giao dịch");
    },
  });
}

export interface BatchDeleteResult {
  total: number;
  succeeded: number;
  failed: number;
}

export function useBatchDeleteTransactionsMutation() {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation<BatchDeleteResult, Error, string[]>({
    mutationFn: async (ids: string[]) => {
      if (!token) throw new Error("Chưa đăng nhập");
      if (ids.length === 0) return { total: 0, succeeded: 0, failed: 0 };

      const results = await Promise.allSettled(ids.map((id) => deleteTransactionApi(token, id)));

      const succeeded = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.filter((r) => r.status === "rejected").length;

      return {
        total: ids.length,
        succeeded,
        failed,
      };
    },
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      if (result.failed === 0) {
        toast(`Đã xóa thành công ${result.succeeded} giao dịch`);
      } else {
        toast(`Đã xóa ${result.succeeded}/${result.total} giao dịch (${result.failed} lỗi)`);
      }
    },
    onError: (err) => {
      toast(err.message || "Lỗi khi xóa hàng loạt giao dịch");
    },
  });
}

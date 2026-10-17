import type {
  CategoryListDto,
  CreateTransactionDto,
  ListTransactionsQuery,
  TransactionDto,
  TransactionListDto,
  UpdateTransactionDto,
} from "@sumio/contract";

import { apiClient } from "@/lib/api-client";

function getErrorMessage(body: unknown, fallback: string): string {
  if (body && typeof body === "object" && "message" in body && typeof body.message === "string") {
    return body.message;
  }

  return fallback;
}

export async function fetchTransactions(
  token: string,
  query: Partial<ListTransactionsQuery> = {},
): Promise<TransactionListDto> {
  const res = await apiClient.transactions.list({
    query,
    headers: { authorization: `Bearer ${token}` },
  });

  if (res.status === 200) {
    return res.body;
  }

  throw new Error(getErrorMessage(res.body, "Failed to fetch transactions"));
}

export async function fetchCategories(token: string): Promise<CategoryListDto> {
  const res = await apiClient.categories.list({
    headers: { authorization: `Bearer ${token}` },
  });

  if (res.status === 200) {
    return res.body;
  }

  throw new Error(getErrorMessage(res.body, "Failed to fetch categories"));
}

export async function createTransactionApi(
  token: string,
  dto: CreateTransactionDto,
): Promise<TransactionDto> {
  const res = await apiClient.transactions.create({
    body: dto,
    headers: { authorization: `Bearer ${token}` },
  });

  if (res.status === 201) {
    return res.body;
  }

  throw new Error(getErrorMessage(res.body, "Failed to create transaction"));
}

export async function updateTransactionApi(
  token: string,
  id: string,
  dto: UpdateTransactionDto,
): Promise<TransactionDto> {
  const res = await apiClient.transactions.update({
    params: { id },
    body: dto,
    headers: { authorization: `Bearer ${token}` },
  });

  if (res.status === 200) {
    return res.body;
  }

  throw new Error(getErrorMessage(res.body, "Failed to update transaction"));
}

export async function deleteTransactionApi(token: string, id: string): Promise<void> {
  const res = await apiClient.transactions.remove({
    params: { id },
    headers: { authorization: `Bearer ${token}` },
  });

  if (res.status === 204) {
    return;
  }

  throw new Error(getErrorMessage(res.body, "Failed to delete transaction"));
}

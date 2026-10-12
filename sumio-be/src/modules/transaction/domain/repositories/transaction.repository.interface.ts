import type { CategoryType } from "../../../category/domain/repositories/category.repository.interface";

export interface TransactionRecord {
  id: string;
  userId: string;
  type: CategoryType;
  /** Positive integer in the currency's minor unit (ADR 0006). */
  amount: number;
  currency: string;
  /** `YYYY-MM-DD` */
  date: string;
  description: string;
  category: { id: string; name: string; type: CategoryType };
  createdAt: Date;
  updatedAt: Date;
}

export interface NewTransaction {
  id?: string;
  userId: string;
  categoryId: string;
  type: CategoryType;
  amount: number;
  currency: string;
  date: string;
  description: string;
}

export interface TransactionPatch {
  categoryId?: string;
  type?: CategoryType;
  amount?: number;
  date?: string;
  description?: string;
}

export interface TransactionFilter {
  page: number;
  pageSize: number;
  from?: string;
  to?: string;
  categoryId?: string;
  type?: CategoryType;
  q?: string;
}

export interface ITransactionRepository {
  list(
    userId: string,
    filter: TransactionFilter,
  ): Promise<{ items: TransactionRecord[]; total: number }>;
  /** Always scoped by user: returns null for another user's transaction. */
  findById(userId: string, id: string): Promise<TransactionRecord | null>;
  create(transaction: NewTransaction): Promise<TransactionRecord>;
  update(userId: string, id: string, patch: TransactionPatch): Promise<TransactionRecord | null>;
  delete(userId: string, id: string): Promise<boolean>;
}

export const TRANSACTION_REPOSITORY = Symbol("TRANSACTION_REPOSITORY");

import type { LucideIcon } from "lucide-react";

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  /** Display date, e.g. "Sep 8, 2025". */
  date: string;
  description: string;
  category: string;
  /** Signed: negative for expenses. */
  amount: number;
  type: TransactionType;
  icon: LucideIcon;
}

export interface SpendingCategory {
  name: string;
  amount: number;
}

export interface WeeklyCashflow {
  label: string;
  income: number;
  expenses: number;
}

export interface UpcomingBill {
  id: string;
  name: string;
  dueLabel: string;
  amount: number;
  icon: LucideIcon;
}

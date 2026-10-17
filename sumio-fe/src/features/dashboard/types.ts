import type { LucideIcon } from "lucide-react";

import type { TransactionType } from "@sumio/contract";

export type { TransactionType };

export interface DashboardTransactionItem {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: TransactionType;
  icon: LucideIcon;
}

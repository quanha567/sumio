import { Receipt } from "lucide-react";
import { useMemo } from "react";

import { useAuth } from "@/features/auth";
import { useTransactionsQuery } from "@/features/transactions";
import { getCategoryMeta } from "@/features/transactions/components/transaction-category-icon";
import { minorUnitsToMajor } from "@/lib/format";

import {
  spendingCategories as mockSpending,
  transactions as mockTransactions,
  upcomingBills,
  weeklyCashflow,
} from "../data/mock";
import type { SpendingCategory, Transaction } from "../types";

export interface DashboardAnalytics {
  totalIncome: number | undefined;
  totalExpense: number | undefined;
  totalBalance: number | undefined;
  savingsRate: string | undefined;
  dashboardTransactions: Transaction[];
  spendingCategories: SpendingCategory[];
  weeklyCashflow: typeof weeklyCashflow;
  upcomingBills: typeof upcomingBills;
  baseCurrency: string;
  userLocale: string;
  isLoading: boolean;
}

export function useDashboardAnalytics(): DashboardAnalytics {
  const { profile } = useAuth();
  const baseCurrency = profile?.settings?.baseCurrency || "USD";
  const userLocale = profile?.settings?.locale || "en-US";

  const { data, isLoading } = useTransactionsQuery({ pageSize: 50 });
  const rawItems = data?.items;

  const analytics = useMemo(() => {
    if (!rawItems || rawItems.length === 0) {
      return {
        totalIncome: undefined,
        totalExpense: undefined,
        totalBalance: undefined,
        savingsRate: undefined,
        dashboardTransactions: mockTransactions,
        spendingCategories: mockSpending,
      };
    }

    let inc = 0;
    let exp = 0;
    const catMap = new Map<string, number>();

    const mapped: Transaction[] = rawItems.slice(0, 10).map((t) => {
      const meta = getCategoryMeta(t.category.name, t.type);
      const major = minorUnitsToMajor(t.amount, t.currency || baseCurrency);
      return {
        id: t.id,
        date: t.date,
        description: t.description || "Untitled Transaction",
        category: t.category.name,
        amount: t.type === "income" ? major : -major,
        type: t.type,
        icon: meta.icon || Receipt,
      };
    });

    for (const t of rawItems) {
      if (t.type === "income") {
        inc += t.amount;
      } else {
        exp += t.amount;
        const current = catMap.get(t.category.name) ?? 0;
        catMap.set(t.category.name, current + t.amount);
      }
    }

    const net = inc - exp;
    const sRate = inc > 0 ? `${Math.max(0, Math.round(((inc - exp) / inc) * 100))}%` : "0%";

    const cats: SpendingCategory[] = Array.from(catMap.entries())
      .map(([name, amount]) => ({
        name,
        amount: minorUnitsToMajor(amount, baseCurrency),
      }))
      .toSorted((a, b) => b.amount - a.amount);

    return {
      totalIncome: inc,
      totalExpense: exp,
      totalBalance: net,
      savingsRate: sRate,
      dashboardTransactions: mapped,
      spendingCategories: cats.length > 0 ? cats : mockSpending,
    };
  }, [rawItems, baseCurrency]);

  return {
    ...analytics,
    weeklyCashflow,
    upcomingBills,
    baseCurrency,
    userLocale,
    isLoading,
  };
}

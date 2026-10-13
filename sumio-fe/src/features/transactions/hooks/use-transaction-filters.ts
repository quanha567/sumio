import type { ListTransactionsQuery } from "@sumio/contract";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { startTransition, useCallback, useMemo } from "react";

import type { TransactionSearch } from "@/routes/_app/transactions";

import { useDebouncedSearch } from "./use-debounced-search";

export const PAGE_SIZE = 10;

function computeDateRange(filter: "all" | "this-month" | "last-month"): {
  from?: string;
  to?: string;
} {
  if (filter === "all") return {};
  const now = new Date();
  if (filter === "this-month") {
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const lastDay = new Date(y, now.getMonth() + 1, 0).getDate();
    return {
      from: `${y}-${m}-01`,
      to: `${y}-${m}-${String(lastDay).padStart(2, "0")}`,
    };
  }
  if (filter === "last-month") {
    const d = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const lastDay = new Date(y, d.getMonth() + 1, 0).getDate();
    return {
      from: `${y}-${m}-01`,
      to: `${y}-${m}-${String(lastDay).padStart(2, "0")}`,
    };
  }
  return {};
}

function parseTransactionSearch(rawSearch: Record<string, unknown>): TransactionSearch {
  const page = typeof rawSearch?.page === "number" && rawSearch.page > 0 ? rawSearch.page : 1;
  const type =
    rawSearch?.type === "income" || rawSearch?.type === "expense" ? rawSearch.type : "all";
  const categoryId = typeof rawSearch?.categoryId === "string" ? rawSearch.categoryId : "all";
  const date =
    rawSearch?.date === "this-month" || rawSearch?.date === "last-month" ? rawSearch.date : "all";
  const q = typeof rawSearch?.q === "string" ? rawSearch.q : "";

  return { page, type, categoryId, date, q };
}

function buildQueryParams(
  search: TransactionSearch,
  dateRange: { from?: string; to?: string },
): Partial<ListTransactionsQuery> {
  return {
    page: search.page,
    pageSize: PAGE_SIZE,
    type: search.type === "all" ? undefined : search.type,
    categoryId: search.categoryId === "all" ? undefined : search.categoryId,
    from: dateRange.from,
    to: dateRange.to,
    q: search.q ? search.q : undefined,
  };
}

export interface TransactionFiltersResult {
  search: TransactionSearch;
  searchInput: string;
  setSearchInput: (value: string) => void;
  queryParams: Partial<ListTransactionsQuery>;
  setPage: (newPage: number) => void;
  setTypeFilter: (type: "all" | "income" | "expense") => void;
  setCategoryFilter: (categoryId: string) => void;
  setDateFilter: (date: "all" | "this-month" | "last-month") => void;
  resetFilters: () => void;
}

export function useTransactionFilters(): TransactionFiltersResult {
  const rawSearch = useSearch({ strict: false }) as Record<string, unknown>;
  const navigate = useNavigate({ from: "/transactions" });

  const search = useMemo(() => parseTransactionSearch(rawSearch), [rawSearch]);

  const handleDebouncedSearch = useCallback(
    (val: string) => {
      const trimmed = val.trim();
      if (trimmed !== (search.q || "")) {
        startTransition(() => {
          void navigate({
            search: (prev) => ({
              ...prev,
              q: trimmed,
              page: 1,
            }),
            replace: true,
          });
        });
      }
    },
    [navigate, search.q],
  );

  const [searchInput, setSearchInput] = useDebouncedSearch(search.q || "", handleDebouncedSearch);

  const dateRange = useMemo(() => computeDateRange(search.date), [search.date]);

  const queryParams = useMemo(() => buildQueryParams(search, dateRange), [search, dateRange]);

  const setPage = useCallback(
    (newPage: number) => {
      startTransition(() => {
        void navigate({
          search: (prev) => ({ ...prev, page: newPage }),
          replace: true,
        });
      });
    },
    [navigate],
  );

  const setTypeFilter = useCallback(
    (type: "all" | "income" | "expense") => {
      startTransition(() => {
        void navigate({
          search: (prev) => ({ ...prev, type, page: 1 }),
          replace: true,
        });
      });
    },
    [navigate],
  );

  const setCategoryFilter = useCallback(
    (categoryId: string) => {
      startTransition(() => {
        void navigate({
          search: (prev) => ({ ...prev, categoryId, page: 1 }),
          replace: true,
        });
      });
    },
    [navigate],
  );

  const setDateFilter = useCallback(
    (date: "all" | "this-month" | "last-month") => {
      startTransition(() => {
        void navigate({
          search: (prev) => ({ ...prev, date, page: 1 }),
          replace: true,
        });
      });
    },
    [navigate],
  );

  const resetFilters = useCallback(() => {
    setSearchInput("");
    startTransition(() => {
      void navigate({
        search: (prev) => ({
          ...prev,
          type: "all",
          categoryId: "all",
          date: "all",
          q: "",
          page: 1,
        }),
        replace: true,
      });
    });
  }, [navigate, setSearchInput]);

  return {
    search,
    searchInput,
    setSearchInput,
    queryParams,
    setPage,
    setTypeFilter,
    setCategoryFilter,
    setDateFilter,
    resetFilters,
  };
}

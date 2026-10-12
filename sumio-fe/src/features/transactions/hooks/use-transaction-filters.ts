import type { ListTransactionsQuery } from "@sumio/contract";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";

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

export function useTransactionFilters() {
  const rawSearch = useSearch({ strict: false }) as Record<string, unknown>;
  const navigate = useNavigate({ from: "/transactions" });

  const search: TransactionSearch = useMemo(
    () => ({
      page: typeof rawSearch?.page === "number" && rawSearch.page > 0 ? rawSearch.page : 1,
      type: rawSearch?.type === "income" || rawSearch?.type === "expense" ? rawSearch.type : "all",
      categoryId: typeof rawSearch?.categoryId === "string" ? rawSearch.categoryId : "all",
      date:
        rawSearch?.date === "this-month" || rawSearch?.date === "last-month"
          ? rawSearch.date
          : "all",
      q: typeof rawSearch?.q === "string" ? rawSearch.q : "",
    }),
    [rawSearch],
  );

  const handleDebouncedSearch = useCallback(
    (val: string) => {
      const trimmed = val.trim();
      if (trimmed !== (search.q || "")) {
        void navigate({
          search: (prev) => ({
            ...prev,
            q: trimmed,
            page: 1,
          }),
          replace: true,
        });
      }
    },
    [navigate, search.q],
  );

  const [searchInput, setSearchInput] = useDebouncedSearch(search.q || "", handleDebouncedSearch);

  const dateRange = useMemo(() => computeDateRange(search.date), [search.date]);

  const queryParams = useMemo<Partial<ListTransactionsQuery>>(() => {
    return {
      page: search.page,
      pageSize: PAGE_SIZE,
      type: search.type === "all" ? undefined : search.type,
      categoryId: search.categoryId === "all" ? undefined : search.categoryId,
      from: dateRange.from,
      to: dateRange.to,
      q: search.q ? search.q : undefined,
    };
  }, [search.page, search.type, search.categoryId, search.q, dateRange]);

  const setPage = useCallback(
    (newPage: number) => {
      void navigate({
        search: (prev) => ({ ...prev, page: newPage }),
        replace: true,
      });
    },
    [navigate],
  );

  const setTypeFilter = useCallback(
    (type: "all" | "income" | "expense") => {
      void navigate({
        search: (prev) => ({ ...prev, type, page: 1 }),
        replace: true,
      });
    },
    [navigate],
  );

  const setCategoryFilter = useCallback(
    (categoryId: string) => {
      void navigate({
        search: (prev) => ({ ...prev, categoryId, page: 1 }),
        replace: true,
      });
    },
    [navigate],
  );

  const setDateFilter = useCallback(
    (date: "all" | "this-month" | "last-month") => {
      void navigate({
        search: (prev) => ({ ...prev, date, page: 1 }),
        replace: true,
      });
    },
    [navigate],
  );

  const resetFilters = useCallback(() => {
    setSearchInput("");
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

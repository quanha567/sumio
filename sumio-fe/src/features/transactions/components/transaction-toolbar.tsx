import type { CategoryDto } from "@sumio/contract";
import {
  ArrowDownLeft,
  ArrowUpDown,
  ArrowUpRight,
  Calendar,
  Plus,
  RefreshCw,
  Tag,
  X,
} from "lucide-react";
import type { RefObject } from "react";
import { useEffect, useMemo, useRef } from "react";

import { Button, SearchField, SelectPill, Spinner, Toolbar } from "@/components/atoms";
import type { SelectOption } from "@/components/atoms/select-pill";

import type { TransactionFiltersResult } from "../hooks/use-transaction-filters";

export interface TransactionToolbarProps {
  filters: TransactionFiltersResult;
  categories: CategoryDto[];
  isLoading: boolean;
  onRefresh: () => void;
  onAddTransaction: () => void;
}

interface ToolbarFiltersProps {
  filters: TransactionFiltersResult;
  categories: CategoryDto[];
}

const TYPE_OPTIONS: SelectOption[] = [
  {
    id: "all",
    label: "All types",
    icon: <ArrowUpDown className="size-3.5" />,
  },
  {
    id: "income",
    label: "Income",
    icon: <ArrowDownLeft className="text-finance-income size-3.5" />,
  },
  {
    id: "expense",
    label: "Expense",
    icon: <ArrowUpRight className="text-finance-expense size-3.5" />,
  },
];

const DATE_OPTIONS: SelectOption[] = [
  { id: "all", label: "All dates" },
  { id: "this-month", label: "This month" },
  { id: "last-month", label: "Last month" },
];

function useSlashKeyFocus(inputRef: RefObject<HTMLInputElement | null>) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inputRef]);
}

function resolveTypeIcon(typeFilter: "all" | "income" | "expense") {
  if (typeFilter === "income") {
    return <ArrowDownLeft className="text-finance-income size-3.5" />;
  }
  if (typeFilter === "expense") {
    return <ArrowUpRight className="text-finance-expense size-3.5" />;
  }
  return <ArrowUpDown className="size-3.5" />;
}

function ToolbarFilters({ filters, categories }: ToolbarFiltersProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  useSlashKeyFocus(searchInputRef);

  const {
    search,
    searchInput,
    setSearchInput,
    setTypeFilter,
    setCategoryFilter,
    setDateFilter,
    resetFilters,
  } = filters;
  const { type: typeFilter, categoryId: categoryFilter, date: dateFilter } = search;

  const hasActiveFilters =
    typeFilter !== "all" ||
    categoryFilter !== "all" ||
    dateFilter !== "all" ||
    searchInput.trim() !== "";

  const activeTypeIcon = useMemo(() => resolveTypeIcon(typeFilter), [typeFilter]);

  const categoryOptions: SelectOption[] = useMemo(
    () => [
      { id: "all", label: "All categories" },
      ...categories
        .filter((c) => typeFilter === "all" || c.type === typeFilter)
        .map((c) => ({ id: c.id, label: c.name })),
    ],
    [categories, typeFilter],
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SearchField
        aria-label="Search description"
        value={searchInput}
        onChange={(val) => setSearchInput(val)}
      >
        <SearchField.Group className="w-full sm:w-48">
          <SearchField.SearchIcon />
          <SearchField.Input ref={searchInputRef} placeholder="Search transactions..." />
          {searchInput !== "" && <SearchField.ClearButton />}
        </SearchField.Group>
      </SearchField>

      <SelectPill
        ariaLabel="Filter transaction type"
        className="w-32"
        value={typeFilter}
        onChange={(val) => setTypeFilter(val as "all" | "income" | "expense")}
        options={TYPE_OPTIONS}
        icon={activeTypeIcon}
      />

      <SelectPill
        ariaLabel="Filter transaction category"
        className="w-36"
        value={categoryFilter}
        onChange={(val) => setCategoryFilter(val)}
        options={categoryOptions}
        icon={<Tag className="size-3.5" />}
      />

      <SelectPill
        ariaLabel="Filter transaction date"
        className="w-32"
        value={dateFilter}
        onChange={(val) => setDateFilter(val as "all" | "this-month" | "last-month")}
        options={DATE_OPTIONS}
        icon={<Calendar className="size-3.5" />}
      />

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onPress={resetFilters} className="h-8 px-2">
          <X className="mr-1 size-3" />
          Reset
        </Button>
      )}
    </div>
  );
}

export function TransactionToolbar({
  filters,
  categories,
  isLoading,
  onRefresh,
  onAddTransaction,
}: TransactionToolbarProps) {
  return (
    <Toolbar
      variant="surface"
      className="flex-col items-stretch gap-3 p-2.5 sm:flex-row sm:items-center sm:justify-between"
    >
      <ToolbarFilters filters={filters} categories={categories} />

      <div className="flex items-center justify-end gap-2 pt-2 sm:pt-0">
        <Button
          variant="outline"
          size="sm"
          onPress={onRefresh}
          disabled={isLoading}
          aria-label="Refresh transactions"
          className="h-8"
        >
          {isLoading ? (
            <Spinner size="sm" />
          ) : (
            <>
              <RefreshCw className="mr-1.5 size-3.5" />
              <span>Refresh</span>
            </>
          )}
        </Button>

        <Button intent="primary" size="sm" onPress={onAddTransaction} className="h-8">
          <Plus className="mr-1.5 size-3.5" />
          <span>New</span>
        </Button>
      </div>
    </Toolbar>
  );
}

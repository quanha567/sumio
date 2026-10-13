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

interface TransactionToolbarProps {
  typeFilter: "all" | "income" | "expense";
  setTypeFilter: (val: "all" | "income" | "expense") => void;
  categoryFilter: string;
  setCategoryFilter: (val: string) => void;
  dateFilter: "all" | "this-month" | "last-month";
  setDateFilter: (val: "all" | "this-month" | "last-month") => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  categories: CategoryDto[];
  isLoading: boolean;
  onRefresh: () => void;
  onAddTransaction: () => void;
  onResetFilters?: () => void;
}

interface ToolbarFiltersProps {
  typeFilter: "all" | "income" | "expense";
  setTypeFilter: (val: "all" | "income" | "expense") => void;
  categoryFilter: string;
  setCategoryFilter: (val: string) => void;
  dateFilter: "all" | "this-month" | "last-month";
  setDateFilter: (val: "all" | "this-month" | "last-month") => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  categories: CategoryDto[];
  hasActiveFilters: boolean;
  onResetFilters?: () => void;
}

const TYPE_OPTIONS: SelectOption[] = [
  {
    id: "all",
    label: "All types",
    icon: <ArrowUpDown className="text-muted size-3.5" />,
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
  return <ArrowUpDown className="text-muted size-3.5" />;
}

function ToolbarFilters({
  typeFilter,
  setTypeFilter,
  categoryFilter,
  setCategoryFilter,
  dateFilter,
  setDateFilter,
  searchQuery,
  setSearchQuery,
  categories,
  hasActiveFilters,
  onResetFilters,
}: ToolbarFiltersProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  useSlashKeyFocus(searchInputRef);

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
        value={searchQuery}
        onChange={(val) => setSearchQuery(val)}
      >
        <SearchField.Group className="w-full sm:w-48">
          <SearchField.SearchIcon />
          <SearchField.Input ref={searchInputRef} placeholder="Search transactions..." />
          {searchQuery !== "" && <SearchField.ClearButton />}
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
        icon={<Tag className="text-muted size-3.5" />}
      />

      <SelectPill
        ariaLabel="Filter transaction date"
        className="w-32"
        value={dateFilter}
        onChange={(val) => setDateFilter(val as "all" | "this-month" | "last-month")}
        options={DATE_OPTIONS}
        icon={<Calendar className="text-muted size-3.5" />}
      />

      {hasActiveFilters && onResetFilters && (
        <Button
          variant="ghost"
          size="sm"
          onPress={onResetFilters}
          className="text-muted hover:text-foreground h-8 px-2 text-xs"
        >
          <X className="mr-1 size-3" />
          Reset
        </Button>
      )}
    </div>
  );
}

export function TransactionToolbar({
  typeFilter,
  setTypeFilter,
  categoryFilter,
  setCategoryFilter,
  dateFilter,
  setDateFilter,
  searchQuery,
  setSearchQuery,
  categories,
  isLoading,
  onRefresh,
  onAddTransaction,
  onResetFilters,
}: TransactionToolbarProps) {
  const hasActiveFilters =
    typeFilter !== "all" ||
    categoryFilter !== "all" ||
    dateFilter !== "all" ||
    searchQuery.trim() !== "";

  return (
    <Toolbar className="bg-surface-secondary/40 flex-col items-stretch gap-3 rounded-xl p-2.5 sm:flex-row sm:items-center sm:justify-between">
      <ToolbarFilters
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categories={categories}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={onResetFilters}
      />

      <div className="flex items-center justify-end gap-2 border-t pt-2 sm:border-t-0 sm:pt-0">
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

        <Button intent="primary" size="sm" onPress={onAddTransaction} className="h-8 shadow-xs">
          <Plus className="mr-1.5 size-3.5" />
          <span>New</span>
        </Button>
      </div>
    </Toolbar>
  );
}

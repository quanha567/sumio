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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const typeOptions: SelectOption[] = [
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

  const activeTypeIcon = useMemo(() => {
    if (typeFilter === "income") {
      return <ArrowDownLeft className="text-finance-income size-3.5" />;
    }
    if (typeFilter === "expense") {
      return <ArrowUpRight className="text-finance-expense size-3.5" />;
    }
    return <ArrowUpDown className="text-muted size-3.5" />;
  }, [typeFilter]);

  const categoryOptions: SelectOption[] = useMemo(
    () => [
      { id: "all", label: "All categories" },
      ...categories
        .filter((c) => typeFilter === "all" || c.type === typeFilter)
        .map((c) => ({ id: c.id, label: c.name })),
    ],
    [categories, typeFilter],
  );

  const dateOptions: SelectOption[] = [
    { id: "all", label: "All dates" },
    { id: "this-month", label: "This month" },
    { id: "last-month", label: "Last month" },
  ];

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
        options={typeOptions}
        icon={activeTypeIcon}
        isActive={typeFilter !== "all"}
      />

      <SelectPill
        ariaLabel="Filter by category"
        className="w-40"
        value={categoryFilter}
        onChange={(val) => setCategoryFilter(val)}
        options={categoryOptions}
        icon={<Tag className="size-3.5" />}
        isActive={categoryFilter !== "all"}
      />

      <SelectPill
        ariaLabel="Filter date range"
        className="w-36"
        value={dateFilter}
        onChange={(val) => setDateFilter(val as "all" | "this-month" | "last-month")}
        options={dateOptions}
        icon={<Calendar className="size-3.5" />}
        isActive={dateFilter !== "all"}
      />

      {hasActiveFilters && onResetFilters && (
        <Button
          intent="ghost"
          size="sm"
          onPress={onResetFilters}
          aria-label="Reset all filters"
          className="gap-1"
        >
          <X className="size-3.5" />
          <span>Reset</span>
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
    <Toolbar
      aria-label="Transaction filters and actions"
      className="flex flex-wrap items-center justify-between gap-3"
    >
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

      <div className="flex items-center gap-2">
        <Button
          isIconOnly
          intent="ghost"
          size="sm"
          onPress={onRefresh}
          isDisabled={isLoading}
          aria-label="Refresh transactions"
          title="Refresh"
        >
          {isLoading ? <Spinner size="sm" /> : <RefreshCw className="size-3.5" />}
        </Button>

        <Button intent="primary" size="sm" className="gap-1.5" onPress={onAddTransaction}>
          <Plus className="size-3.5" />
          <span>Add transaction</span>
        </Button>
      </div>
    </Toolbar>
  );
}

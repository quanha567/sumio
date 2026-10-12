import { Plus } from "lucide-react";

import { PageHeader } from "@/components/common";
import { Button, Card, Pagination } from "@/components/ui";
import { useAuth } from "@/features/auth";

import {
  TransactionBatchBar,
  TransactionModals,
  TransactionSummaryPanel,
  TransactionTableView,
  TransactionToolbar,
} from "./components";
import { useTransactionList, useTransactionModals } from "./hooks";

export function TransactionsPage() {
  const { profile } = useAuth();
  const baseCurrency = profile?.settings?.baseCurrency || "USD";
  const userLocale = profile?.settings?.locale || "en-US";

  const list = useTransactionList();
  const modals = useTransactionModals();

  const totalPages = Math.ceil(list.total / list.pageSize);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Transactions"
        description="Monitor and manage your financial cash flow."
        action={
          <Button intent="primary" onPress={() => modals.openCreate("expense")} className="gap-2">
            <Plus className="size-4" />
            <span>Add Transaction</span>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="min-w-0 space-y-4 lg:col-span-8 xl:col-span-9">
          <Card padding="md">
            <div className="space-y-4">
              <TransactionToolbar
                typeFilter={list.search.type}
                setTypeFilter={list.setTypeFilter}
                categoryFilter={list.search.categoryId}
                setCategoryFilter={list.setCategoryFilter}
                dateFilter={list.search.date}
                setDateFilter={list.setDateFilter}
                searchQuery={list.searchInput}
                setSearchQuery={list.setSearchInput}
                categories={list.categories}
                isLoading={list.isLoading}
                onRefresh={() => list.refetch()}
                onAddTransaction={() => modals.openCreate("expense")}
                onResetFilters={list.resetFilters}
              />

              <TransactionBatchBar
                selectedCount={list.selectedIds.size}
                onClearSelection={list.clearSelection}
                onBatchDelete={list.handleBatchDelete}
                isDeleting={list.isBatchDeleting}
              />

              <TransactionTableView
                transactions={list.transactions}
                isLoading={list.isLoading}
                isError={list.isError}
                errorMessage={list.error?.message}
                onRetry={() => list.refetch()}
                selectedIds={list.selectedIds}
                baseCurrency={baseCurrency}
                userLocale={userLocale}
                onToggleSelectAll={list.toggleSelectAll}
                onToggleSelectRow={list.toggleSelectRow}
                onEdit={modals.openEdit}
                onDelete={modals.openDelete}
              />

              {totalPages > 1 && (
                <div className="border-border/40 flex justify-center border-t pt-4">
                  <Pagination
                    page={list.page}
                    total={totalPages}
                    onChange={(p) => list.setPage(p)}
                  />
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4 xl:col-span-3">
          <TransactionSummaryPanel
            transactions={list.transactions}
            currency={baseCurrency}
            locale={userLocale}
            onAddIncome={() => modals.openCreate("income")}
            onAddExpense={() => modals.openCreate("expense")}
          />
        </div>
      </div>

      <TransactionModals
        modals={modals}
        categories={list.categories}
        baseCurrency={baseCurrency}
        userLocale={userLocale}
      />
    </div>
  );
}

import { Plus } from "lucide-react";

import { BatchActionBar, PageHeader } from "@/components/common";
import { PageContainer, SplitLayout } from "@/components/layout";
import { Button, Card, Pagination, Separator } from "@/components/ui";
import { useAuth } from "@/features/auth";

import {
  DeleteConfirmModal,
  TransactionFormModal,
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
    <PageContainer>
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

      <SplitLayout
        main={
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

              <BatchActionBar
                selectedCount={list.selectedIds.size}
                onClearSelection={list.clearSelection}
                onDelete={list.handleBatchDelete}
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
                <div className="pt-2">
                  <Separator className="mb-4" />
                  <div className="flex justify-center">
                    <Pagination
                      page={list.page}
                      total={totalPages}
                      onChange={(p) => list.setPage(p)}
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>
        }
        aside={
          <TransactionSummaryPanel
            transactions={list.transactions}
            currency={baseCurrency}
            locale={userLocale}
            onAddIncome={() => modals.openCreate("income")}
            onAddExpense={() => modals.openCreate("expense")}
          />
        }
      />

      <TransactionFormModal
        isOpen={modals.isFormOpen}
        onClose={modals.closeForm}
        categories={list.categories}
        defaultType={modals.formDefaultType}
        editingTransaction={modals.editingTx}
        onSave={modals.handleSave}
        baseCurrency={baseCurrency}
        isSaving={modals.isSaving}
      />

      <DeleteConfirmModal
        isOpen={modals.isDeleteOpen}
        onClose={modals.closeDelete}
        transaction={modals.deletingTx}
        onConfirm={modals.handleConfirmDelete}
        isDeleting={modals.isDeleting}
        baseCurrency={baseCurrency}
        userLocale={userLocale}
      />
    </PageContainer>
  );
}

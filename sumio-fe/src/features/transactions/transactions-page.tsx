import { Plus } from "lucide-react";

import { Button, Card, Pagination, Separator } from "@/components/atoms";
import { BatchActionBar, PageHeader } from "@/components/molecules";
import { PageContainer, SplitLayout } from "@/components/templates";
import { useAuth } from "@/features/auth";

import {
  DeleteConfirmModal,
  TransactionFormModal,
  TransactionSummaryPanel,
  TransactionTableView,
  TransactionToolbar,
} from "./components";
import { useTransactionList as useList, useTransactionModals as useModals } from "./hooks";
import type { useTransactionList, useTransactionModals } from "./hooks";

interface TransactionMainCardProps {
  list: ReturnType<typeof useTransactionList>;
  modals: ReturnType<typeof useTransactionModals>;
  baseCurrency: string;
  userLocale: string;
  totalPages: number;
}

function TransactionMainCard({
  list,
  modals,
  baseCurrency,
  userLocale,
  totalPages,
}: TransactionMainCardProps): React.JSX.Element {
  return (
    <Card padding="md">
      <div className="space-y-4">
        <TransactionToolbar
          filters={list}
          categories={list.categories}
          isLoading={list.isLoading}
          onRefresh={() => list.refetch()}
          onAddTransaction={() => modals.openCreate("expense")}
        />

        <BatchActionBar
          selectedCount={list.selectedIds.size}
          onClearSelection={() => list.clearSelection()}
          onDelete={list.handleBatchDelete}
          isDeleting={list.isBatchDeleting}
        />

        <TransactionTableView
          transactions={list.transactions}
          isLoading={list.isLoading}
          isError={list.isError}
          errorMessage={list.error?.message}
          onRetry={() => list.refetch()}
          selection={list}
          baseCurrency={baseCurrency}
          userLocale={userLocale}
          onEdit={(tx) => modals.openEdit(tx)}
          onDelete={(tx) => modals.openDelete(tx)}
        />

        {totalPages > 1 && (
          <div className="pt-2">
            <Separator className="mb-4" />
            <div className="flex justify-center">
              <Pagination page={list.page} total={totalPages} onChange={(p) => list.setPage(p)} />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

export function TransactionsPage(): React.JSX.Element {
  const { profile } = useAuth();
  const baseCurrency = profile?.settings?.baseCurrency || "USD";
  const userLocale = profile?.settings?.locale || "en-US";

  const list = useList();
  const modals = useModals();

  const totalPages = Math.ceil(list.total / list.pageSize);

  return (
    <PageContainer>
      <PageHeader
        title="Transactions"
        description="Monitor and manage your financial cash flow."
        action={
          <Button intent="primary" onPress={() => modals.openCreate("expense")} className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Add Transaction</span>
          </Button>
        }
      />

      <SplitLayout
        main={
          <TransactionMainCard
            list={list}
            modals={modals}
            baseCurrency={baseCurrency}
            userLocale={userLocale}
            totalPages={totalPages}
          />
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
        onClose={() => modals.closeForm()}
        categories={list.categories}
        defaultType={modals.formDefaultType}
        editingTransaction={modals.editingTx}
        onSave={modals.handleSave}
        baseCurrency={baseCurrency}
        isSaving={modals.isSaving}
      />

      <DeleteConfirmModal
        isOpen={modals.isDeleteOpen}
        onClose={() => modals.closeDelete()}
        transaction={modals.deletingTx}
        onConfirm={modals.handleConfirmDelete}
        isDeleting={modals.isDeleting}
        baseCurrency={baseCurrency}
        userLocale={userLocale}
      />
    </PageContainer>
  );
}

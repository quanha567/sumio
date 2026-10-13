import { PageContainer, SplitLayout } from "@/components/templates";

import { GreetingBanner } from "./components/greeting-banner";
import { KpiCards } from "./components/kpi-cards";
import { SpendingOverview } from "./components/spending-overview";
import { TransactionsTable } from "./components/transactions-table";
import { useDashboardAnalytics } from "./hooks/use-dashboard-analytics";

interface DashboardPageProps {
  userName: string;
}

export function DashboardPage({ userName }: DashboardPageProps) {
  const {
    totalIncome,
    totalExpense,
    totalBalance,
    savingsRate,
    dashboardTransactions,
    spendingCategories,
    baseCurrency,
    userLocale,
    isLoading,
  } = useDashboardAnalytics();

  return (
    <PageContainer>
      <GreetingBanner userName={userName} />

      <KpiCards
        totalBalance={totalBalance}
        monthlyIncome={totalIncome}
        monthlyExpenses={totalExpense}
        savingsRate={savingsRate}
        currency={baseCurrency}
        locale={userLocale}
        isLoading={isLoading}
      />

      <SplitLayout
        ratio="wide"
        main={<TransactionsTable transactions={dashboardTransactions} />}
        aside={<SpendingOverview categories={spendingCategories} />}
      />
    </PageContainer>
  );
}

import { FinancialGoalCard } from "./components/financial-goal-card";
import { GreetingBanner } from "./components/greeting-banner";
import { IncomeVsExpenses } from "./components/income-vs-expenses";
import { KpiCards } from "./components/kpi-cards";
import { QuickActions } from "./components/quick-actions";
import { SpendingOverview } from "./components/spending-overview";
import { TransactionsTable } from "./components/transactions-table";
import { UpcomingBills } from "./components/upcoming-bills";
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
    weeklyCashflow,
    upcomingBills,
    baseCurrency,
    userLocale,
    isLoading,
  } = useDashboardAnalytics();

  return (
    <div className="space-y-5">
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

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <SpendingOverview categories={spendingCategories} />
        <IncomeVsExpenses data={weeklyCashflow} />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="min-w-0 xl:col-span-7 2xl:col-span-8">
          <TransactionsTable transactions={dashboardTransactions} />
        </div>

        <div className="space-y-5 xl:col-span-5 2xl:col-span-4">
          <UpcomingBills bills={upcomingBills} />
          <FinancialGoalCard title="Save for a new laptop" saved={820} target={1200} />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}

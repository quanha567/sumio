import { FinancialGoalCard } from "./components/financial-goal-card";
import { GreetingBanner } from "./components/greeting-banner";
import { IncomeVsExpenses } from "./components/income-vs-expenses";
import { KpiCards } from "./components/kpi-cards";
import { QuickActions } from "./components/quick-actions";
import { SpendingOverview } from "./components/spending-overview";
import { TransactionsList } from "./components/transactions-list";
import { TransactionsTable } from "./components/transactions-table";
import { UpcomingBills } from "./components/upcoming-bills";
import { spendingCategories, transactions, upcomingBills, weeklyCashflow } from "./data/mock";

interface DashboardPageProps {
  userName: string;
}

export function DashboardPage({ userName }: DashboardPageProps) {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
      <div className="min-w-0 space-y-5 xl:col-span-9">
        <GreetingBanner userName={userName} />
        <KpiCards />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <SpendingOverview categories={spendingCategories} />
          <IncomeVsExpenses data={weeklyCashflow} />
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
          <div className="min-w-0 lg:col-span-3">
            <TransactionsTable transactions={transactions} />
          </div>
          <div className="lg:col-span-2">
            <QuickActions />
          </div>
        </div>
      </div>

      <div className="space-y-5 xl:col-span-3">
        <UpcomingBills bills={upcomingBills} />
        <FinancialGoalCard title="Save for a new laptop" saved={820} target={1200} />
        <TransactionsList transactions={transactions} />
      </div>
    </div>
  );
}

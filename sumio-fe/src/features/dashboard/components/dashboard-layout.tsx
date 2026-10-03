import { BudgetsCard } from "./budgets-card";
import { GoalsCard } from "./goals-card";
import { GreetingBanner } from "./greeting-banner";
import { Header } from "./header";
import { IncomeExpenseChart } from "./income-expense-chart";
import { MetricCards } from "./metric-cards";
import { QuickAddCard } from "./quick-add-card";
import { RecentTransactionsCard } from "./recent-transactions-card";
import { Sidebar } from "./sidebar";
import { SpendingOverviewChart } from "./spending-overview-chart";

export function DashboardLayout() {
  return (
    <div className="bg-background text-foreground flex min-h-screen w-full">
      {/* Left Sidebar - Full height docked to the left */}
      <div className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col overflow-y-auto px-4 py-6 lg:block xl:w-64">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
        {/* Top Header */}
        <Header />

        {/* Main Grid Content */}
        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-12">
          {/* Center / Primary Column (Span 9 on xl) */}
          <div className="space-y-5 xl:col-span-9">
            {/* Greeting Hero Banner */}
            <GreetingBanner />

            {/* 4 Metric KPI Cards */}
            <MetricCards />

            {/* Middle Section: Spending Overview + Income vs Expenses */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <SpendingOverviewChart />
              <IncomeExpenseChart />
            </div>

            {/* Bottom Section: Budgets + Goals */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <BudgetsCard />
              <GoalsCard />
            </div>
          </div>

          {/* Right Column (Span 3 on xl) */}
          <div className="space-y-5 xl:col-span-3">
            <QuickAddCard />
            <RecentTransactionsCard />
          </div>
        </div>
      </main>
    </div>
  );
}

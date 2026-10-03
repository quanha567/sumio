import { BarChart2, Clock, Compass, FileText, Home, Palmtree, Settings } from "lucide-react";

import { Card } from "@/components/ui";

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "entries", label: "Entries", icon: FileText },
  { id: "budgets", label: "Budgets", icon: Clock },
  { id: "goals", label: "Goals", icon: Compass },
  { id: "reports", label: "Reports", icon: BarChart2 },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({ activeTab = "home", onTabChange }: SidebarProps) {
  return (
    <aside className="flex h-full w-full flex-col justify-between">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-2.5 px-2 py-1">
          <div className="bg-accent text-accent-foreground shadow-accent/25 flex h-9 w-9 items-center justify-center rounded-xl shadow-md">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              viewBox="0 0 24 24"
            >
              <path
                d="M2.5 19c0-8 6.5-14.5 14.5-14.5a4.5 4.5 0 0 1 4.5 4.5c0 8-6.5 14.5-14.5 14.5-1.5 0-3-.5-4.5-1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M2.5 19c5-5 10-7 14.5-8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-foreground text-xl font-bold tracking-tight">Summer</span>
            <span className="text-xl">☀️</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange?.(item.id)}
                className={`flex w-full cursor-pointer items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-surface-tertiary text-foreground font-semibold shadow-xs"
                    : "text-muted hover:bg-surface-secondary hover:text-foreground"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-accent" : "text-muted"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Bottom Banner & Savings Progress */}
      <div className="mt-8 space-y-2.5">
        <Card className="border-border from-surface-secondary to-surface-tertiary relative overflow-hidden bg-gradient-to-b p-3 text-center shadow-xs">
          <div className="relative mb-1.5 flex justify-center">
            <div className="bg-surface text-accent flex h-9 w-9 items-center justify-center rounded-2xl shadow-xs">
              <Palmtree className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="text-foreground font-serif text-xs leading-snug font-semibold">
            Better habits
            <br />
            brighter future 💚
          </p>
        </Card>

        {/* Savings Gauge */}
        <div className="border-border bg-surface flex items-center gap-2.5 rounded-2xl border p-2.5 shadow-xs">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
            <svg className="h-10 w-10 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-default"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-success"
                strokeDasharray="68, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="text-foreground absolute text-[10px] font-bold">68%</span>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-muted text-[10px] font-medium">Monthly savings</p>
            <p className="text-foreground text-[11px] font-bold">$ 2,040 / $ 3,000</p>
            <div className="bg-default mt-1 h-1.5 w-full overflow-hidden rounded-full">
              <div className="bg-success h-full rounded-full" style={{ width: "68%" }} />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

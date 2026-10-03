import { Bus, ChevronRight, Coffee, Film, Palmtree, ShoppingCart } from "lucide-react";

import { Card } from "@/components/ui";

interface TransactionItem {
  id: string;
  title: string;
  category: string;
  date: string;
  amount: string;
  icon: typeof Palmtree;
  iconBg: string;
  iconColor: string;
}

const transactions: TransactionItem[] = [
  {
    id: "tx-1",
    title: "Travel to Bali",
    category: "Travel",
    date: "May 5, 2025",
    amount: "- $ 45.00",
    icon: Palmtree,
    iconBg: "bg-accent/15",
    iconColor: "text-accent",
  },
  {
    id: "tx-2",
    title: "Grocery shopping",
    category: "Food & Dining",
    date: "May 3, 2025",
    amount: "- $ 12.50",
    icon: ShoppingCart,
    iconBg: "bg-danger/15",
    iconColor: "text-danger",
  },
  {
    id: "tx-3",
    title: "Coffee & snack",
    category: "Food & Dining",
    date: "May 2, 2025",
    amount: "- $ 12.50",
    icon: Coffee,
    iconBg: "bg-warning/15",
    iconColor: "text-warning",
  },
  {
    id: "tx-4",
    title: "Bus ticket",
    category: "Transport",
    date: "May 1, 2025",
    amount: "- $ 3.00",
    icon: Bus,
    iconBg: "bg-surface-secondary",
    iconColor: "text-foreground",
  },
  {
    id: "tx-5",
    title: "Netflix",
    category: "Entertainment",
    date: "Apr 28, 2025",
    amount: "- $ 15.99",
    icon: Film,
    iconBg: "bg-surface-tertiary",
    iconColor: "text-foreground",
  },
];

function TransactionItemRow({ tx }: { tx: TransactionItem }) {
  const Icon = tx.icon;

  return (
    <div className="group hover:bg-surface-secondary -mx-1.5 flex cursor-pointer items-center justify-between rounded-xl p-1.5 transition-colors">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${tx.iconBg} ${tx.iconColor}`}
        >
          <Icon className="h-4.5 w-4.5" />
        </div>
        <div>
          <p className="text-foreground text-xs font-semibold">{tx.title}</p>
          <p className="text-muted text-[11px]">
            {tx.category} • {tx.date}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-danger text-xs font-bold">{tx.amount}</span>
        <ChevronRight className="text-muted group-hover:text-accent h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </div>
    </div>
  );
}

export function RecentTransactionsCard() {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-foreground text-base font-bold">Recent Transactions</h2>

        <button
          type="button"
          className="text-accent flex cursor-pointer items-center gap-1 text-xs font-semibold hover:opacity-80"
        >
          <span>View all</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {transactions.map((tx) => (
          <TransactionItemRow key={tx.id} tx={tx} />
        ))}
      </div>
    </Card>
  );
}

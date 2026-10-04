import { Coffee, Home, ShoppingBag, Tv, Utensils, Wallet, Wifi, Zap } from "lucide-react";

import type { SpendingCategory, Transaction, UpcomingBill, WeeklyCashflow } from "../types";

/** Mock data until the API exists. Components receive these via props. */

export const spendingCategories: SpendingCategory[] = [
  { name: "Food & Dining", amount: 742.2 },
  { name: "Shopping", amount: 417.68 },
  { name: "Transport", amount: 278.46 },
  { name: "Housing", amount: 185.64 },
  { name: "Entertainment", amount: 139.23 },
  { name: "Others", amount: 556.79 },
];

export const weeklyCashflow: WeeklyCashflow[] = [
  { label: "Aug 18", income: 2100, expenses: 1500 },
  { label: "Aug 25", income: 2900, expenses: 1700 },
  { label: "Sep 1", income: 3300, expenses: 2300 },
  { label: "Sep 8", income: 4500, expenses: 2600 },
];

export const transactions: Transaction[] = [
  {
    id: "t1",
    date: "Sep 8, 2025",
    description: "Starbucks",
    category: "Food & Dining",
    amount: -5.5,
    type: "expense",
    icon: Coffee,
  },
  {
    id: "t2",
    date: "Sep 8, 2025",
    description: "Shopee",
    category: "Shopping",
    amount: -15.99,
    type: "expense",
    icon: ShoppingBag,
  },
  {
    id: "t3",
    date: "Sep 6, 2025",
    description: "Salary",
    category: "Income",
    amount: 2500,
    type: "income",
    icon: Wallet,
  },
  {
    id: "t4",
    date: "Sep 5, 2025",
    description: "Grocery",
    category: "Food & Dining",
    amount: -32.4,
    type: "expense",
    icon: Utensils,
  },
  {
    id: "t5",
    date: "Sep 4, 2025",
    description: "Rent",
    category: "Housing",
    amount: -185.64,
    type: "expense",
    icon: Home,
  },
];

export const upcomingBills: UpcomingBill[] = [
  { id: "b1", name: "Rent", dueLabel: "Due in 2 days", amount: 800, icon: Home },
  { id: "b2", name: "Internet", dueLabel: "Due in 5 days", amount: 25, icon: Wifi },
  { id: "b3", name: "Electricity", dueLabel: "Due in 7 days", amount: 45, icon: Zap },
  { id: "b4", name: "Netflix", dueLabel: "Due in 12 days", amount: 15.99, icon: Tv },
];

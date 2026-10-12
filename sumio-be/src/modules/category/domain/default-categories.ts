import type { CategoryType } from "./repositories/category.repository.interface";

export const DEFAULT_CATEGORIES: ReadonlyArray<{ name: string; type: CategoryType }> = [
  { name: "Food", type: "expense" },
  { name: "Rent", type: "expense" },
  { name: "Transport", type: "expense" },
  { name: "Shopping", type: "expense" },
  { name: "Bills", type: "expense" },
  { name: "Entertainment", type: "expense" },
  { name: "Other", type: "expense" },
  { name: "Salary", type: "income" },
  { name: "Freelance", type: "income" },
  { name: "Other", type: "income" },
];

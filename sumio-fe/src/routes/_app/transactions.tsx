import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { TransactionsPage } from "@/features/transactions";

export const transactionSearchSchema = z.object({
  page: z.coerce.number().int().positive().catch(1).default(1),
  type: z.enum(["all", "income", "expense"]).catch("all").default("all"),
  categoryId: z.string().catch("all").default("all"),
  date: z.enum(["all", "this-month", "last-month"]).catch("all").default("all"),
  q: z.string().catch("").default(""),
});

export type TransactionSearch = z.infer<typeof transactionSearchSchema>;

export const Route = createFileRoute("/_app/transactions")({
  validateSearch: (search: Record<string, unknown>): TransactionSearch =>
    transactionSearchSchema.parse(search),
  component: TransactionsPage,
});

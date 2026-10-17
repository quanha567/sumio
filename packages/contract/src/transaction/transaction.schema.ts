import { z } from "zod";

export const TransactionTypeSchema = z.enum(["income", "expense"]);
export type TransactionType = z.infer<typeof TransactionTypeSchema>;

/** Positive integer in the currency's minor unit (ISO 4217 exponent). See ADR 0006. */
export const AmountSchema = z.number().int().positive().max(Number.MAX_SAFE_INTEGER);

export const CurrencyCodeSchema = z.string().regex(/^[A-Z]{3}$/, "Must be an ISO 4217 code");

/** Calendar date `YYYY-MM-DD` with no time or timezone. */
export const DateOnlySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }, "Invalid calendar date");

export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  type: TransactionTypeSchema,
  createdAt: z.string().datetime(),
});
export type CategoryDto = z.infer<typeof CategorySchema>;

export const TransactionSchema = z.object({
  id: z.string().uuid(),
  type: TransactionTypeSchema,
  amount: AmountSchema,
  currency: CurrencyCodeSchema,
  date: DateOnlySchema,
  description: z.string(),
  category: CategorySchema.pick({ id: true, name: true, type: true }),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type TransactionDto = z.infer<typeof TransactionSchema>;

export const CreateTransactionSchema = z.object({
  type: TransactionTypeSchema,
  amount: AmountSchema,
  /** Defaults to the user's base currency when omitted. */
  currency: CurrencyCodeSchema.optional(),
  date: DateOnlySchema,
  description: z.string().trim().max(255).default(""),
  categoryId: z.string().uuid(),
});
export type CreateTransactionDto = z.infer<typeof CreateTransactionSchema>;

/** Currency is immutable after creation. */
export const UpdateTransactionSchema = CreateTransactionSchema.omit({ currency: true })
  .partial()
  .refine((value) => Object.keys(value).length > 0, "At least one field is required");
export type UpdateTransactionDto = z.infer<typeof UpdateTransactionSchema>;

export const ListTransactionsQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
    from: DateOnlySchema.optional(),
    to: DateOnlySchema.optional(),
    categoryId: z.string().uuid().optional(),
    type: TransactionTypeSchema.optional(),
    q: z.string().trim().min(1).max(100).optional(),
  })
  .refine((value) => !value.from || !value.to || value.from <= value.to, {
    message: "`from` must not be after `to`",
    path: ["from"],
  });
export type ListTransactionsQuery = z.infer<typeof ListTransactionsQuerySchema>;

export const TransactionListSchema = z.object({
  items: z.array(TransactionSchema),
  page: z.number().int(),
  pageSize: z.number().int(),
  total: z.number().int(),
});
export type TransactionListDto = z.infer<typeof TransactionListSchema>;

export const CategoryListSchema = z.object({ items: z.array(CategorySchema) });
export type CategoryListDto = z.infer<typeof CategoryListSchema>;

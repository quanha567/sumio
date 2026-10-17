import { describe, expect, test } from "bun:test";

import {
  CreateTransactionSchema,
  ListTransactionsQuerySchema,
  UpdateTransactionSchema,
} from "./transaction.schema.js";

const valid = {
  type: "expense",
  amount: 50000,
  currency: "VND",
  date: "2026-10-05",
  description: "Lunch",
  categoryId: "3f2b8c1e-5a9d-4c7e-9b1a-2d6e8f0a1b3c",
};

describe("CreateTransactionSchema", () => {
  test("accepts a valid transaction", () => {
    expect(CreateTransactionSchema.safeParse(valid).success).toBe(true);
  });

  test("allows omitting currency (defaults to the user's base currency)", () => {
    const { currency: _currency, ...rest } = valid;
    expect(CreateTransactionSchema.safeParse(rest).success).toBe(true);
  });

  test.each([0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1])("rejects amount %p", (amount) => {
    expect(CreateTransactionSchema.safeParse({ ...valid, amount }).success).toBe(false);
  });

  test("rejects a non-calendar date", () => {
    expect(CreateTransactionSchema.safeParse({ ...valid, date: "2026-02-30" }).success).toBe(false);
    expect(CreateTransactionSchema.safeParse({ ...valid, date: "05/10/2026" }).success).toBe(false);
  });

  test("allows a future date", () => {
    expect(CreateTransactionSchema.safeParse({ ...valid, date: "2999-01-01" }).success).toBe(true);
  });

  test("rejects unknown type and bad currency", () => {
    expect(CreateTransactionSchema.safeParse({ ...valid, type: "transfer" }).success).toBe(false);
    expect(CreateTransactionSchema.safeParse({ ...valid, currency: "vnd" }).success).toBe(false);
  });
});

describe("UpdateTransactionSchema", () => {
  test("accepts a partial update but not an empty one", () => {
    expect(UpdateTransactionSchema.safeParse({ amount: 10 }).success).toBe(true);
    expect(UpdateTransactionSchema.safeParse({}).success).toBe(false);
  });

  test("does not allow changing currency", () => {
    const parsed = UpdateTransactionSchema.safeParse({ amount: 10, currency: "USD" });
    expect(parsed.success && "currency" in parsed.data).toBe(false);
  });
});

describe("ListTransactionsQuerySchema", () => {
  test("applies pagination defaults and coerces query strings", () => {
    const parsed = ListTransactionsQuerySchema.parse({});
    expect(parsed.page).toBe(1);
    expect(parsed.pageSize).toBe(20);
    expect(ListTransactionsQuerySchema.parse({ page: "3", pageSize: "50" })).toMatchObject({
      page: 3,
      pageSize: 50,
    });
  });

  test("caps pageSize and rejects an inverted date range", () => {
    expect(ListTransactionsQuerySchema.safeParse({ pageSize: "101" }).success).toBe(false);
    expect(
      ListTransactionsQuerySchema.safeParse({ from: "2026-10-05", to: "2026-10-01" }).success,
    ).toBe(false);
  });
});

import { describe, expect, it, vi } from "vitest";

import type {
  CategoryRecord,
  ICategoryRepository,
} from "../../../category/domain/repositories/category.repository.interface";
import { InvalidCategoryError } from "../../domain/errors/invalid-category.error";
import { TransactionNotFoundError } from "../../domain/errors/transaction-not-found.error";
import type {
  ITransactionRepository,
  NewTransaction,
  TransactionRecord,
} from "../../domain/repositories/transaction.repository.interface";
import { CreateTransactionUseCase } from "./create-transaction.use-case";
import { DeleteTransactionUseCase } from "./delete-transaction.use-case";
import { UpdateTransactionUseCase } from "./update-transaction.use-case";

const USER = "user-1";
const food: CategoryRecord = {
  id: "cat-food",
  name: "Food",
  type: "expense",
  createdAt: new Date(),
};
const salary: CategoryRecord = {
  id: "cat-salary",
  name: "Salary",
  type: "income",
  createdAt: new Date(),
};

const makeCategories = (rows: CategoryRecord[]): ICategoryRepository => ({
  findAllByUser: vi.fn(),
  findByIdAndUser: vi
    .fn()
    .mockImplementation((_userId: string, id: string) =>
      Promise.resolve(rows.find((row) => row.id === id) ?? null),
    ),
  insertIgnoringDuplicates: vi.fn(),
});

const makeRecord = (overrides: Partial<TransactionRecord> = {}): TransactionRecord => ({
  id: "tx-1",
  userId: USER,
  type: "expense",
  amount: 1000,
  currency: "USD",
  date: "2026-10-05",
  description: "",
  category: { id: food.id, name: food.name, type: food.type },
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

const makeTransactions = (existing: TransactionRecord | null = null): ITransactionRepository => ({
  list: vi.fn(),
  findById: vi
    .fn()
    .mockImplementation((userId: string) =>
      Promise.resolve(existing && existing.userId === userId ? existing : null),
    ),
  create: vi
    .fn()
    .mockImplementation((tx: NewTransaction) =>
      Promise.resolve(
        makeRecord({ ...tx, category: { id: tx.categoryId, name: "x", type: tx.type } }),
      ),
    ),
  update: vi.fn().mockImplementation(() => Promise.resolve(existing)),
  delete: vi.fn().mockImplementation(() => Promise.resolve(existing !== null)),
});

describe("CreateTransactionUseCase", () => {
  const input = {
    userId: USER,
    baseCurrency: "VND",
    dto: {
      type: "expense" as const,
      amount: 50000,
      date: "2026-10-05",
      description: "Lunch",
      categoryId: food.id,
    },
  };

  it("defaults currency to the user's base currency", async () => {
    const transactions = makeTransactions();
    const useCase = new CreateTransactionUseCase(transactions, makeCategories([food]));

    await useCase.execute(input);

    expect(transactions.create).toHaveBeenCalledWith(
      expect.objectContaining({ userId: USER, currency: "VND", amount: 50000 }),
    );
  });

  it("keeps an explicitly provided currency", async () => {
    const transactions = makeTransactions();
    const useCase = new CreateTransactionUseCase(transactions, makeCategories([food]));

    await useCase.execute({ ...input, dto: { ...input.dto, currency: "USD" } });

    expect(transactions.create).toHaveBeenCalledWith(expect.objectContaining({ currency: "USD" }));
  });

  it("rejects a category that does not belong to the user", async () => {
    const useCase = new CreateTransactionUseCase(makeTransactions(), makeCategories([]));

    await expect(useCase.execute(input)).rejects.toBeInstanceOf(InvalidCategoryError);
  });

  it("rejects a category whose type differs from the transaction type", async () => {
    const transactions = makeTransactions();
    const useCase = new CreateTransactionUseCase(transactions, makeCategories([salary]));

    await expect(
      useCase.execute({ ...input, dto: { ...input.dto, categoryId: salary.id } }),
    ).rejects.toBeInstanceOf(InvalidCategoryError);

    expect(transactions.create).not.toHaveBeenCalled();
  });
});

describe("UpdateTransactionUseCase", () => {
  it("throws not-found for another user's transaction", async () => {
    const useCase = new UpdateTransactionUseCase(
      makeTransactions(makeRecord({ userId: "someone-else" })),
      makeCategories([food, salary]),
    );

    await expect(
      useCase.execute({ userId: USER, id: "tx-1", dto: { amount: 5 } }),
    ).rejects.toBeInstanceOf(TransactionNotFoundError);
  });

  it("re-validates the category when only the type changes", async () => {
    const transactions = makeTransactions(makeRecord());
    const useCase = new UpdateTransactionUseCase(transactions, makeCategories([food, salary]));

    await expect(
      useCase.execute({ userId: USER, id: "tx-1", dto: { type: "income" } }),
    ).rejects.toBeInstanceOf(InvalidCategoryError);

    expect(transactions.update).not.toHaveBeenCalled();
  });

  it("accepts a type change together with a matching category", async () => {
    const transactions = makeTransactions(makeRecord());
    const useCase = new UpdateTransactionUseCase(transactions, makeCategories([food, salary]));

    await useCase.execute({
      userId: USER,
      id: "tx-1",
      dto: { type: "income", categoryId: salary.id },
    });

    expect(transactions.update).toHaveBeenCalledWith(USER, "tx-1", {
      type: "income",
      categoryId: salary.id,
    });
  });

  it("skips category lookup when neither type nor category changes", async () => {
    const categories = makeCategories([food]);
    const useCase = new UpdateTransactionUseCase(makeTransactions(makeRecord()), categories);

    await useCase.execute({ userId: USER, id: "tx-1", dto: { amount: 2000 } });

    expect(categories.findByIdAndUser).not.toHaveBeenCalled();
  });
});

describe("DeleteTransactionUseCase", () => {
  it("deletes the user's own transaction", async () => {
    const transactions = makeTransactions(makeRecord());

    await new DeleteTransactionUseCase(transactions).execute({ userId: USER, id: "tx-1" });
    expect(transactions.delete).toHaveBeenCalledWith(USER, "tx-1");
  });

  it("throws not-found when nothing was deleted", async () => {
    const useCase = new DeleteTransactionUseCase(makeTransactions(null));

    await expect(useCase.execute({ userId: USER, id: "nope" })).rejects.toBeInstanceOf(
      TransactionNotFoundError,
    );
  });
});

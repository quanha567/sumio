import { describe, expect, it, vi } from "vitest";

import { DEFAULT_CATEGORIES } from "../../domain/default-categories";
import type { ICategoryRepository } from "../../domain/repositories/category.repository.interface";
import { SeedDefaultCategoriesUseCase } from "../commands/seed-default-categories/seed-default-categories.use-case";
import { ListCategoriesUseCase } from "./list-categories.use-case";

const makeRepo = (existing: Awaited<ReturnType<ICategoryRepository["findAllByUser"]>> = []) => {
  const state = { rows: [...existing] };
  const repo: ICategoryRepository = {
    findAllByUser: vi.fn().mockImplementation(() => Promise.resolve(state.rows)),
    findByIdAndUser: vi.fn(),
    insertIgnoringDuplicates: vi.fn().mockImplementation((_userId, items) => {
      state.rows = items.map((item: { id: string; name: string; type: "income" | "expense" }) => ({
        ...item,
        createdAt: new Date(),
      }));
      return Promise.resolve();
    }),
  };
  return repo;
};

describe("SeedDefaultCategoriesUseCase", () => {
  it("inserts the default set with unique ids for the user", async () => {
    const repo = makeRepo();
    await new SeedDefaultCategoriesUseCase(repo).execute("user-1");

    const [userId, items] = (repo.insertIgnoringDuplicates as ReturnType<typeof vi.fn>).mock
      .calls[0];
    expect(userId).toBe("user-1");
    expect(items).toHaveLength(DEFAULT_CATEGORIES.length);
    expect(new Set(items.map((item: { id: string }) => item.id)).size).toBe(items.length);
    expect(
      items.map((item: { name: string; type: string }) => `${item.type}:${item.name}`),
    ).toContain("income:Salary");
  });
});

describe("ListCategoriesUseCase", () => {
  it("self-heals by seeding defaults when the user has no categories", async () => {
    const repo = makeRepo();
    const result = await new ListCategoriesUseCase(
      repo,
      new SeedDefaultCategoriesUseCase(repo),
    ).execute("user-1");

    expect(repo.insertIgnoringDuplicates).toHaveBeenCalledOnce();
    expect(result).toHaveLength(DEFAULT_CATEGORIES.length);
  });

  it("does not seed when categories already exist", async () => {
    const repo = makeRepo([{ id: "c1", name: "Custom", type: "expense", createdAt: new Date() }]);
    const result = await new ListCategoriesUseCase(
      repo,
      new SeedDefaultCategoriesUseCase(repo),
    ).execute("user-1");

    expect(repo.insertIgnoringDuplicates).not.toHaveBeenCalled();
    expect(result).toHaveLength(1);
  });
});

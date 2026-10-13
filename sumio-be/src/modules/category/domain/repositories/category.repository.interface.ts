export type CategoryType = "income" | "expense";

export interface CategoryRecord {
  id: string;
  name: string;
  type: CategoryType;
  createdAt: Date;
}

export interface NewCategory {
  id: string;
  name: string;
  type: CategoryType;
}

export interface ICategoryRepository {
  findAllByUser(userId: string): Promise<CategoryRecord[]>;
  /** Scoped by user: returns null for another user's category. */
  findByIdAndUser(userId: string, id: string): Promise<CategoryRecord | null>;
  /** Inserts categories, silently skipping any (user, type, name) that already exists. */
  insertIgnoringDuplicates(userId: string, categories: NewCategory[]): Promise<void>;
}

export const CATEGORY_REPOSITORY = Symbol("CATEGORY_REPOSITORY");

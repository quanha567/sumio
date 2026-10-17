import { Inject, Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";

import type { IUseCase } from "../../../../../shared/application/use-case.interface";
import { DEFAULT_CATEGORIES } from "../../../domain/default-categories";
import {
  CATEGORY_REPOSITORY,
  type ICategoryRepository,
} from "../../../domain/repositories/category.repository.interface";

/** Idempotent: duplicates for (user, type, name) are skipped by the repository. */
@Injectable()
export class SeedDefaultCategoriesUseCase implements IUseCase<string, void> {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  public async execute(userId: string): Promise<void> {
    await this.categoryRepository.insertIgnoringDuplicates(
      userId,
      DEFAULT_CATEGORIES.map(({ name, type }) => ({ id: randomUUID(), name, type })),
    );
  }
}

import { Inject, Injectable } from "@nestjs/common";

import type { IUseCase } from "../../../../shared/application/use-case.interface";
import {
  CATEGORY_REPOSITORY,
  type CategoryRecord,
  type ICategoryRepository,
} from "../../domain/repositories/category.repository.interface";
import { SeedDefaultCategoriesUseCase } from "../commands/seed-default-categories/seed-default-categories.use-case";

@Injectable()
export class ListCategoriesUseCase implements IUseCase<string, CategoryRecord[]> {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
    @Inject(SeedDefaultCategoriesUseCase)
    private readonly seedDefaultCategories: SeedDefaultCategoriesUseCase,
  ) {}

  public async execute(userId: string): Promise<CategoryRecord[]> {
    const categories = await this.categoryRepository.findAllByUser(userId);

    if (categories.length > 0) return categories;

    // Self-heal users provisioned before seeding existed (or whose seeding failed).
    await this.seedDefaultCategories.execute(userId);

    return this.categoryRepository.findAllByUser(userId);
  }
}

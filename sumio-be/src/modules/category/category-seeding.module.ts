import { Module } from "@nestjs/common";

import { SeedDefaultCategoriesUseCase } from "./application/commands/seed-default-categories/seed-default-categories.use-case";
import { CATEGORY_REPOSITORY } from "./domain/repositories/category.repository.interface";
import { TypeOrmCategoryRepository } from "./infrastructure/persistence/repositories/typeorm-category.repository";

/**
 * Persistence and seeding only (no HTTP). Kept separate from CategoryModule so that
 * UserModule can seed on provisioning without a circular import (CategoryModule's
 * controller needs UserModule's auth guard).
 */
@Module({
  providers: [
    { provide: CATEGORY_REPOSITORY, useClass: TypeOrmCategoryRepository },
    SeedDefaultCategoriesUseCase,
  ],
  exports: [CATEGORY_REPOSITORY, SeedDefaultCategoriesUseCase],
})
export class CategorySeedingModule {}

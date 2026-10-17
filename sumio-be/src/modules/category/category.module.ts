import { Module } from "@nestjs/common";

import { ListCategoriesUseCase } from "./application/queries/list-categories.use-case";
import { CategorySeedingModule } from "./category-seeding.module";
import { CategoryController } from "./interface/http/category.controller";

@Module({
  imports: [CategorySeedingModule],
  controllers: [CategoryController],
  providers: [ListCategoriesUseCase],
  exports: [CategorySeedingModule],
})
export class CategoryModule {}

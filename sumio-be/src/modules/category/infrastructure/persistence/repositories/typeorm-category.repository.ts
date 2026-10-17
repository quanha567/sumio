import { Inject, Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import type {
  CategoryRecord,
  ICategoryRepository,
  NewCategory,
} from "../../../domain/repositories/category.repository.interface";
import { CategoryOrmEntity } from "../entities/category.orm-entity";

@Injectable()
export class TypeOrmCategoryRepository implements ICategoryRepository {
  constructor(@Inject(DataSource) private readonly dataSource: DataSource) {}

  private async repo() {
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
    }

    return this.dataSource.getRepository(CategoryOrmEntity);
  }

  public async findAllByUser(userId: string): Promise<CategoryRecord[]> {
    const rows = await (
      await this.repo()
    ).find({
      where: { userId },
      order: { type: "ASC", name: "ASC" },
    });

    return rows.map(({ id, name, type, createdAt }) => ({ id, name, type, createdAt }));
  }

  public async findByIdAndUser(userId: string, id: string): Promise<CategoryRecord | null> {
    const row = await (await this.repo()).findOne({ where: { id, userId } });

    return row ? { id: row.id, name: row.name, type: row.type, createdAt: row.createdAt } : null;
  }

  public async insertIgnoringDuplicates(userId: string, categories: NewCategory[]): Promise<void> {
    if (categories.length === 0) return;

    await (
      await this.repo()
    )
      .createQueryBuilder()
      .insert()
      .into(CategoryOrmEntity)
      .values(categories.map((category) => ({ ...category, userId })))
      .orIgnore()
      .execute();
  }
}

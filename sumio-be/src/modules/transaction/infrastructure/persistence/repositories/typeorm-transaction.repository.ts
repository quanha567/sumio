import { Inject, Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import type {
  ITransactionRepository,
  NewTransaction,
  TransactionFilter,
  TransactionPatch,
  TransactionRecord,
} from "../../../domain/repositories/transaction.repository.interface";
import { TransactionOrmEntity } from "../entities/transaction.orm-entity";

const toRecord = (row: TransactionOrmEntity): TransactionRecord => ({
  id: row.id,
  userId: row.userId,
  type: row.type,
  amount: row.amount,
  currency: row.currency,
  date: row.date,
  description: row.description,
  category: { id: row.category.id, name: row.category.name, type: row.category.type },
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

/** Escapes LIKE wildcards so user input is matched literally. */
const escapeLike = (value: string) => value.replaceAll(/[\\%_]/gu, String.raw`\$&`);

@Injectable()
export class TypeOrmTransactionRepository implements ITransactionRepository {
  constructor(@Inject(DataSource) private readonly dataSource: DataSource) {}

  private async repo() {
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
    }
    return this.dataSource.getRepository(TransactionOrmEntity);
  }

  public async list(userId: string, filter: TransactionFilter) {
    const query = (await this.repo())
      .createQueryBuilder("t")
      .innerJoinAndSelect("t.category", "c")
      .where("t.userId = :userId", { userId });

    if (filter.from) query.andWhere("t.date >= :from", { from: filter.from });
    if (filter.to) query.andWhere("t.date <= :to", { to: filter.to });
    if (filter.categoryId)
      query.andWhere("t.categoryId = :categoryId", { categoryId: filter.categoryId });
    if (filter.type) query.andWhere("t.type = :type", { type: filter.type });
    if (filter.q) {
      query.andWhere(String.raw`t.description ILIKE :q ESCAPE '\'`, {
        q: `%${escapeLike(filter.q)}%`,
      });
    }

    const [rows, total] = await query
      .orderBy("t.date", "DESC")
      .addOrderBy("t.createdAt", "DESC")
      .addOrderBy("t.id", "DESC")
      .skip((filter.page - 1) * filter.pageSize)
      .take(filter.pageSize)
      .getManyAndCount();

    return { items: rows.map((row) => toRecord(row)), total };
  }

  public async findById(userId: string, id: string): Promise<TransactionRecord | null> {
    const row = await (await this.repo()).findOne({ where: { id, userId } });
    return row ? toRecord(row) : null;
  }

  public async create(transaction: NewTransaction): Promise<TransactionRecord> {
    const repo = await this.repo();
    const id = transaction.id ?? crypto.randomUUID();
    await repo.insert({ ...transaction, id });
    const created = await this.findById(transaction.userId, id);
    if (!created) throw new Error("Transaction vanished right after insert.");
    return created;
  }

  public async update(
    userId: string,
    id: string,
    patch: TransactionPatch,
  ): Promise<TransactionRecord | null> {
    const repo = await this.repo();
    const result = await repo.update({ id, userId }, patch);
    if (!result.affected) return null;
    return this.findById(userId, id);
  }

  public async delete(userId: string, id: string): Promise<boolean> {
    const result = await (await this.repo()).delete({ id, userId });
    return (result.affected ?? 0) > 0;
  }
}

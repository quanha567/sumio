import { Inject, Injectable } from "@nestjs/common";
import type { UpdateTransactionDto } from "@sumio/contract";

import type { IUseCase } from "../../../../shared/application/use-case.interface";
import {
  CATEGORY_REPOSITORY,
  type ICategoryRepository,
} from "../../../category/domain/repositories/category.repository.interface";
import { InvalidCategoryError } from "../../domain/errors/invalid-category.error";
import { TransactionNotFoundError } from "../../domain/errors/transaction-not-found.error";
import {
  type ITransactionRepository,
  TRANSACTION_REPOSITORY,
  type TransactionRecord,
} from "../../domain/repositories/transaction.repository.interface";

export interface UpdateTransactionCommand {
  userId: string;
  id: string;
  dto: UpdateTransactionDto;
}

@Injectable()
export class UpdateTransactionUseCase implements IUseCase<
  UpdateTransactionCommand,
  TransactionRecord
> {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactions: ITransactionRepository,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categories: ICategoryRepository,
  ) {}

  public async execute({ userId, id, dto }: UpdateTransactionCommand): Promise<TransactionRecord> {
    const existing = await this.transactions.findById(userId, id);
    if (!existing) throw new TransactionNotFoundError();

    // The resulting (type, category) pair must stay consistent even if only one side changes.
    if (dto.type !== undefined || dto.categoryId !== undefined) {
      const nextType = dto.type ?? existing.type;
      const nextCategoryId = dto.categoryId ?? existing.category.id;
      const category = await this.categories.findByIdAndUser(userId, nextCategoryId);
      if (category?.type !== nextType) {
        throw new InvalidCategoryError();
      }
    }

    const updated = await this.transactions.update(userId, id, dto);
    if (!updated) throw new TransactionNotFoundError();
    return updated;
  }
}

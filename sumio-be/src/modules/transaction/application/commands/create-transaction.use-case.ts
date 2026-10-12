import { Inject, Injectable } from "@nestjs/common";
import type { CreateTransactionDto } from "@sumio/contract";

import type { IUseCase } from "../../../../shared/application/use-case.interface";
import {
  CATEGORY_REPOSITORY,
  type ICategoryRepository,
} from "../../../category/domain/repositories/category.repository.interface";
import { InvalidCategoryError } from "../../domain/errors/invalid-category.error";
import {
  type ITransactionRepository,
  TRANSACTION_REPOSITORY,
  type TransactionRecord,
} from "../../domain/repositories/transaction.repository.interface";

export interface CreateTransactionCommand {
  userId: string;
  /** The user's base currency, used when the request omits `currency`. */
  baseCurrency: string;
  dto: CreateTransactionDto;
}

@Injectable()
export class CreateTransactionUseCase implements IUseCase<
  CreateTransactionCommand,
  TransactionRecord
> {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactions: ITransactionRepository,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categories: ICategoryRepository,
  ) {}

  public async execute({
    userId,
    baseCurrency,
    dto,
  }: CreateTransactionCommand): Promise<TransactionRecord> {
    const category = await this.categories.findByIdAndUser(userId, dto.categoryId);
    if (category?.type !== dto.type) {
      throw new InvalidCategoryError();
    }

    return this.transactions.create({
      userId,
      categoryId: dto.categoryId,
      type: dto.type,
      amount: dto.amount,
      currency: dto.currency ?? baseCurrency,
      date: dto.date,
      description: dto.description,
    });
  }
}

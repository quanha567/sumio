import { Inject, Injectable } from "@nestjs/common";

import type { IUseCase } from "../../../../shared/application/use-case.interface";
import { TransactionNotFoundError } from "../../domain/errors/transaction-not-found.error";
import {
  type ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from "../../domain/repositories/transaction.repository.interface";

export interface DeleteTransactionCommand {
  userId: string;
  id: string;
}

@Injectable()
export class DeleteTransactionUseCase implements IUseCase<DeleteTransactionCommand, void> {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactions: ITransactionRepository,
  ) {}

  public async execute({ userId, id }: DeleteTransactionCommand): Promise<void> {
    const deleted = await this.transactions.delete(userId, id);

    if (!deleted) throw new TransactionNotFoundError();
  }
}

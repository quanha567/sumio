import { Inject, Injectable } from "@nestjs/common";

import type { ListTransactionsQuery } from "@sumio/contract";

import type { IUseCase } from "../../../../shared/application/use-case.interface";
import {
  type ITransactionRepository,
  TRANSACTION_REPOSITORY,
  type TransactionRecord,
} from "../../domain/repositories/transaction.repository.interface";

export interface ListTransactionsCommand {
  userId: string;
  query: ListTransactionsQuery;
}

@Injectable()
export class ListTransactionsUseCase implements IUseCase<
  ListTransactionsCommand,
  { items: TransactionRecord[]; total: number }
> {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactions: ITransactionRepository,
  ) {}

  public execute({ userId, query }: ListTransactionsCommand) {
    return this.transactions.list(userId, query);
  }
}

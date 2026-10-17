import { Controller, Inject, UseGuards } from "@nestjs/common";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";

import { transactionContract } from "@sumio/contract";

import { CurrentUser, FirebaseAuthGuard, type AuthenticatedUser } from "@/modules/auth";
import { CreateTransactionUseCase } from "@/modules/transaction/application/commands/create-transaction.use-case";
import { DeleteTransactionUseCase } from "@/modules/transaction/application/commands/delete-transaction.use-case";
import { UpdateTransactionUseCase } from "@/modules/transaction/application/commands/update-transaction.use-case";
import { ListTransactionsUseCase } from "@/modules/transaction/application/queries/list-transactions.use-case";
import type { TransactionRecord } from "@/modules/transaction/domain/repositories/transaction.repository.interface";

const toDto = (record: TransactionRecord) => ({
  id: record.id,
  type: record.type,
  amount: record.amount,
  currency: record.currency,
  date: record.date,
  description: record.description,
  category: record.category,
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString(),
});

@Controller()
@UseGuards(FirebaseAuthGuard)
export class TransactionController {
  constructor(
    @Inject(ListTransactionsUseCase) private readonly listTransactions: ListTransactionsUseCase,
    @Inject(CreateTransactionUseCase) private readonly createTransaction: CreateTransactionUseCase,
    @Inject(UpdateTransactionUseCase) private readonly updateTransaction: UpdateTransactionUseCase,
    @Inject(DeleteTransactionUseCase) private readonly deleteTransaction: DeleteTransactionUseCase,
  ) {}

  @TsRestHandler(transactionContract.list)
  public list(@CurrentUser() user: AuthenticatedUser) {
    return tsRestHandler(transactionContract.list, async ({ query }) => {
      const { items, total } = await this.listTransactions.execute({
        userId: user.id,
        query,
      });

      return {
        status: 200,
        body: {
          items: items.map((item) => toDto(item)),
          page: query.page,
          pageSize: query.pageSize,
          total,
        },
      };
    });
  }

  @TsRestHandler(transactionContract.create)
  public create(@CurrentUser() user: AuthenticatedUser) {
    return tsRestHandler(transactionContract.create, async ({ body }) => {
      const created = await this.createTransaction.execute({
        userId: user.id,
        baseCurrency: user.baseCurrency,
        dto: body,
      });

      return { status: 201, body: toDto(created) };
    });
  }

  @TsRestHandler(transactionContract.update)
  public update(@CurrentUser() user: AuthenticatedUser) {
    return tsRestHandler(transactionContract.update, async ({ params, body }) => {
      const updated = await this.updateTransaction.execute({
        userId: user.id,
        id: params.id,
        dto: body,
      });

      return { status: 200, body: toDto(updated) };
    });
  }

  @TsRestHandler(transactionContract.remove)
  public remove(@CurrentUser() user: AuthenticatedUser) {
    return tsRestHandler(transactionContract.remove, async ({ params }) => {
      await this.deleteTransaction.execute({ userId: user.id, id: params.id });

      return { status: 204, body: undefined };
    });
  }
}

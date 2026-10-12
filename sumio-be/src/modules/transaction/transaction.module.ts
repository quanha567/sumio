import { Module } from "@nestjs/common";

import { CategorySeedingModule } from "@/modules/category/category-seeding.module";

import { CreateTransactionUseCase } from "./application/commands/create-transaction.use-case";
import { DeleteTransactionUseCase } from "./application/commands/delete-transaction.use-case";
import { UpdateTransactionUseCase } from "./application/commands/update-transaction.use-case";
import { ListTransactionsUseCase } from "./application/queries/list-transactions.use-case";
import { TRANSACTION_REPOSITORY } from "./domain/repositories/transaction.repository.interface";
import { TypeOrmTransactionRepository } from "./infrastructure/persistence/repositories/typeorm-transaction.repository";
import { TransactionController } from "./interface/http/transaction.controller";

@Module({
  imports: [CategorySeedingModule],
  controllers: [TransactionController],
  providers: [
    { provide: TRANSACTION_REPOSITORY, useClass: TypeOrmTransactionRepository },
    ListTransactionsUseCase,
    CreateTransactionUseCase,
    UpdateTransactionUseCase,
    DeleteTransactionUseCase,
  ],
})
export class TransactionModule {}

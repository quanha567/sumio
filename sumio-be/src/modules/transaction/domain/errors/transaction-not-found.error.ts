import { NotFoundDomainException } from "@/shared";

export class TransactionNotFoundError extends NotFoundDomainException {
  constructor(message = "Transaction not found.") {
    super(message, "TRANSACTION_NOT_FOUND");
  }
}

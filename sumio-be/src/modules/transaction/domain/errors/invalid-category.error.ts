import { ValidationDomainException } from "@/shared";

/** The Category does not exist for this user, or its type differs from the Transaction Type. */
export class InvalidCategoryError extends ValidationDomainException {
  constructor(message = "Category not found or does not match the transaction type.") {
    super(message, "INVALID_CATEGORY");
  }
}

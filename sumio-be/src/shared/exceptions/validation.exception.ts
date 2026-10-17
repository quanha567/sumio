import { DomainException } from "./domain.exception";

export class ValidationDomainException extends DomainException {
  readonly statusCode = 400;
  readonly errorCode: string;

  constructor(message: string, errorCode = "VALIDATION_ERROR") {
    super(message);
    this.errorCode = errorCode;
  }
}

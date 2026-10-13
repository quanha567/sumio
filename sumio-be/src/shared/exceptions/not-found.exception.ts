import { DomainException } from "./domain.exception";

export class NotFoundDomainException extends DomainException {
  readonly statusCode = 404;
  readonly errorCode: string;

  constructor(message: string, errorCode = "NOT_FOUND") {
    super(message);
    this.errorCode = errorCode;
  }
}

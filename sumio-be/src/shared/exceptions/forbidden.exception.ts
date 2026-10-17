import { DomainException } from "./domain.exception";

export class ForbiddenDomainException extends DomainException {
  readonly statusCode = 403;
  readonly errorCode: string;

  constructor(message = "Forbidden resource", errorCode = "FORBIDDEN") {
    super(message);
    this.errorCode = errorCode;
  }
}

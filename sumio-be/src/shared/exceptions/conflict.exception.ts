import { DomainException } from "./domain.exception";

export class ConflictDomainException extends DomainException {
  readonly statusCode = 409;
  readonly errorCode: string;

  constructor(message: string, errorCode = "CONFLICT") {
    super(message);
    this.errorCode = errorCode;
  }
}

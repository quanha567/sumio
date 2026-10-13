/**
 * Base class for all domain-level exceptions in Sumio Backend.
 * Automatically caught by DomainExceptionFilter and converted to standardized HTTP responses.
 */
export abstract class DomainException extends Error {
  abstract readonly statusCode: number;
  abstract readonly errorCode: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

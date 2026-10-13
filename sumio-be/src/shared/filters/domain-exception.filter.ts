import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpStatus,
  Logger,
} from "@nestjs/common";

import { DomainException } from "../exceptions/domain.exception";

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name);

  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = exception.statusCode ?? HttpStatus.BAD_REQUEST;

    const payload = {
      statusCode,
      message: exception.message,
      error: exception.errorCode,
      timestamp: new Date().toISOString(),
    };

    this.logger.warn(`[DomainException] ${exception.errorCode}: ${exception.message}`);

    // Compatible with Fastify (response.code().send()) and Express (response.status().json())
    if (typeof response.status === "function" && typeof response.send === "function") {
      response.status(statusCode).send(payload);
    } else if (typeof response.code === "function" && typeof response.send === "function") {
      response.code(statusCode).send(payload);
    } else if (typeof response.status === "function" && typeof response.json === "function") {
      response.status(statusCode).json(payload);
    } else {
      response.send(payload);
    }
  }
}

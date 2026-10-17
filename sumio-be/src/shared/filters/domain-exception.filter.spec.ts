import type { ArgumentsHost } from "@nestjs/common";
import { describe, expect, it, vi } from "vitest";

import { NotFoundDomainException } from "../exceptions/not-found.exception";
import { ValidationDomainException } from "../exceptions/validation.exception";
import { DomainExceptionFilter } from "./domain-exception.filter";

describe("DomainExceptionFilter", () => {
  it("should catch ValidationDomainException and format HTTP 400 response", () => {
    const filter = new DomainExceptionFilter();
    const mockSend = vi.fn();
    const mockStatus = vi.fn().mockReturnValue({ send: mockSend });

    const host = {
      switchToHttp: () => ({
        getResponse: () => ({
          status: mockStatus,
          send: mockSend,
        }),
      }),
    } as unknown as ArgumentsHost;

    const exception = new ValidationDomainException("Invalid input", "INVALID_INPUT");

    filter.catch(exception, host);

    expect(mockStatus).toHaveBeenCalledWith(400);

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: "Invalid input",
        error: "INVALID_INPUT",
      }),
    );
  });

  it("should catch NotFoundDomainException and format HTTP 404 response", () => {
    const filter = new DomainExceptionFilter();
    const mockSend = vi.fn();
    const mockStatus = vi.fn().mockReturnValue({ send: mockSend });

    const host = {
      switchToHttp: () => ({
        getResponse: () => ({
          status: mockStatus,
          send: mockSend,
        }),
      }),
    } as unknown as ArgumentsHost;

    const exception = new NotFoundDomainException("Resource not found", "ITEM_NOT_FOUND");

    filter.catch(exception, host);

    expect(mockStatus).toHaveBeenCalledWith(404);

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
        message: "Resource not found",
        error: "ITEM_NOT_FOUND",
      }),
    );
  });
});

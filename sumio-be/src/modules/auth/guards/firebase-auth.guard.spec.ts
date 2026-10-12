import { type ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { describe, expect, it, vi } from "vitest";

import type { SyncUserUseCase } from "@/modules/user/application/commands/sync-user/sync-user.use-case";
import { User } from "@/modules/user/domain/entities/user.entity";
import { Email } from "@/modules/user/domain/value-objects/email.vo";

import type { ITokenVerifier } from "../ports/token-verifier.port";
import { FirebaseAuthGuard } from "./firebase-auth.guard";

describe("FirebaseAuthGuard", () => {
  it("should throw UnauthorizedException if Authorization header is missing", async () => {
    const mockTokenVerifier = { verifyIdToken: vi.fn() };
    const mockSyncUserUseCase = { execute: vi.fn() };
    const guard = new FirebaseAuthGuard(
      mockTokenVerifier as unknown as ITokenVerifier,
      mockSyncUserUseCase as unknown as SyncUserUseCase,
    );

    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: {} }),
      }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it("should verify token, execute JIT sync, and attach AuthenticatedUser principal to request", async () => {
    const mockTokenVerifier = {
      verifyIdToken: vi.fn().mockResolvedValue({
        uid: "fb-123",
        email: "test@example.com",
        name: "Test User",
        claims: {},
      }),
    };

    const mockUser = User.create({
      email: Email.create("test@example.com"),
      firebaseUid: "fb-123",
      displayName: "Test User",
    });

    const mockSyncUserUseCase = {
      execute: vi.fn().mockResolvedValue(mockUser),
    };

    const guard = new FirebaseAuthGuard(
      mockTokenVerifier as unknown as ITokenVerifier,
      mockSyncUserUseCase as unknown as SyncUserUseCase,
    );

    const req: Record<string, unknown> = {
      headers: {
        authorization: "Bearer valid-token-123",
      },
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => req,
      }),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(mockTokenVerifier.verifyIdToken).toHaveBeenCalledWith("valid-token-123");
    expect(mockSyncUserUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        firebaseUid: "fb-123",
        email: "test@example.com",
      }),
    );
    expect(req.user).toEqual({
      id: mockUser.id.value,
      email: mockUser.email.value,
      firebaseUid: "fb-123",
      baseCurrency: mockUser.settings.baseCurrency.code,
    });
  });
});

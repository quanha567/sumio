import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import type { Request } from "express";

import { SyncUserUseCase } from "../../application/commands/sync-user/sync-user.use-case.js";
import {
  type ITokenVerifier,
  TOKEN_VERIFIER,
} from "../../application/ports/token-verifier.port.js";

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    @Inject(TOKEN_VERIFIER)
    private readonly tokenVerifier: ITokenVerifier,
    @Inject(SyncUserUseCase)
    private readonly syncUserUseCase: SyncUserUseCase,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing or malformed Authorization header.");
    }

    const token = authHeader.slice(7).trim();
    if (!token) {
      throw new UnauthorizedException("Bearer token is empty.");
    }

    const verified = await this.tokenVerifier.verifyIdToken(token);
    if (!verified.email) {
      throw new UnauthorizedException("Firebase user must have an email associated.");
    }

    // JIT Provisioning / Reconciliation
    const domainUser = await this.syncUserUseCase.execute({
      firebaseUid: verified.uid,
      email: verified.email,
      displayName: verified.name,
      photoUrl: verified.picture,
      claims: verified.claims,
    });

    // Attach to request for @CurrentUser() decorator
    (request as unknown as Record<string, unknown>).user = domainUser;

    return true;
  }
}

import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import type { FastifyRequest } from "fastify";

import { SyncUserUseCase } from "@/modules/user/application/commands/sync-user/sync-user.use-case";

import { type ITokenVerifier, TOKEN_VERIFIER } from "../ports/token-verifier.port";
import type { AuthenticatedUser } from "../types/authenticated-user.interface";

type AuthenticatedRequest = FastifyRequest & { user?: AuthenticatedUser };

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    @Inject(TOKEN_VERIFIER)
    private readonly tokenVerifier: ITokenVerifier,
    @Inject(SyncUserUseCase)
    private readonly syncUserUseCase: SyncUserUseCase,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
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

    // JIT Provisioning / Reconciliation with UserModule
    const domainUser = await this.syncUserUseCase.execute({
      firebaseUid: verified.uid,
      email: verified.email,
      displayName: verified.name,
      photoUrl: verified.picture,
      claims: verified.claims,
    });

    // Attach lightweight principal to request for @CurrentUser() decorator
    request.user = {
      id: domainUser.id.value,
      email: domainUser.email.value,
      firebaseUid: verified.uid,
      baseCurrency: domainUser.settings.baseCurrency.code,
    };

    return true;
  }
}

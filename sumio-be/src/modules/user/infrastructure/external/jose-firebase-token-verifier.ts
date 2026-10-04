import { Injectable, UnauthorizedException } from "@nestjs/common";
import { createRemoteJWKSet, jwtVerify } from "jose";

import { ITokenVerifier, VerifiedToken } from "../../application/ports/token-verifier.port.js";

const GOOGLE_JWKS_URL = new URL(
  "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com",
);

@Injectable()
export class JoseFirebaseTokenVerifier implements ITokenVerifier {
  private readonly jwks = createRemoteJWKSet(GOOGLE_JWKS_URL);

  public async verifyIdToken(token: string): Promise<VerifiedToken> {
    const projectId = process.env.FIREBASE_PROJECT_ID || "sumio-app";

    try {
      const { payload } = await jwtVerify(token, this.jwks, {
        issuer: `https://securetoken.google.com/${projectId}`,
        audience: projectId,
      });

      if (!payload.sub) {
        throw new UnauthorizedException("Token payload missing subject identifier (uid).");
      }

      return {
        uid: payload.sub,
        email: typeof payload.email === "string" ? payload.email : undefined,
        name: typeof payload.name === "string" ? payload.name : undefined,
        picture: typeof payload.picture === "string" ? payload.picture : undefined,
        claims: payload as Record<string, unknown>,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid or expired Firebase token.";
      throw new UnauthorizedException(`Authentication failed: ${message}`);
    }
  }
}

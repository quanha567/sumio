export const TOKEN_VERIFIER = Symbol("TOKEN_VERIFIER");

export interface VerifiedToken {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
  claims: Record<string, unknown>;
}

export interface ITokenVerifier {
  verifyIdToken(token: string): Promise<VerifiedToken>;
}

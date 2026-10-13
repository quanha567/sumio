/**
 * Lightweight principal context representing the authenticated user in HTTP request handlers.
 * Decoupled from any internal entity aggregate root.
 */
export interface AuthenticatedUser {
  /** Database user ID (UUID string) */
  id: string;
  /** Primary email of user */
  email: string;
  /** Firebase Auth UID */
  firebaseUid: string;
  /** User's base currency code (e.g. "VND", "USD") */
  baseCurrency: string;
}

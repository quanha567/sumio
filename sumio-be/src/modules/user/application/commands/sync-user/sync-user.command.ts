export interface SyncUserCommand {
  firebaseUid: string;
  email: string;
  displayName?: string | null;
  photoUrl?: string | null;
  claims?: Record<string, unknown>;
}

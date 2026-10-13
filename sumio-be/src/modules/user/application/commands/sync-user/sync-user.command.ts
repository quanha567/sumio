import type { Nullable } from "@sumio/common";

export interface SyncUserCommand {
  firebaseUid: string;
  email: string;
  displayName?: Nullable<string>;
  photoUrl?: Nullable<string>;
  claims?: Record<string, unknown>;
}

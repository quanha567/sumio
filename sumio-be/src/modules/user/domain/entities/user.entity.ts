import { Entity } from "../../../../shared/domain/entity.base.js";
import { Email } from "../value-objects/email.vo.js";
import { UserId } from "../value-objects/user-id.vo.js";
import { UserIdentity } from "./user-identity.entity.js";
import { UserSettings } from "./user-settings.entity.js";

export type UserStatus = "ACTIVE" | "SUSPENDED";

export interface UserProps {
  email: Email;
  displayName: string | null;
  photoUrl: string | null;
  status: UserStatus;
  identities: UserIdentity[];
  settings: UserSettings;
  createdAt: Date;
  updatedAt: Date;
}

export class User extends Entity<UserId> {
  private _email: Email;
  private _displayName: string | null;
  private _photoUrl: string | null;
  private _status: UserStatus;
  private _identities: UserIdentity[];
  private _settings: UserSettings;
  private _updatedAt: Date;

  private constructor(
    id: UserId,
    private readonly props: UserProps,
  ) {
    super(id);
    this._email = props.email;
    this._displayName = props.displayName;
    this._photoUrl = props.photoUrl;
    this._status = props.status;
    this._identities = props.identities;
    this._settings = props.settings;
    this._updatedAt = props.updatedAt;
  }

  public get email(): Email {
    return this._email;
  }

  public get displayName(): string | null {
    return this._displayName;
  }

  public get photoUrl(): string | null {
    return this._photoUrl;
  }

  public get status(): UserStatus {
    return this._status;
  }

  public get identities(): readonly UserIdentity[] {
    return Object.freeze([...this._identities]);
  }

  public get settings(): UserSettings {
    return this._settings;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public linkOrUpdateFirebaseIdentity(firebaseUid: string, claims: Record<string, unknown>): void {
    const existing = this._identities.find(
      (id) => id.provider === "firebase" && id.providerUid === firebaseUid,
    );

    if (existing) {
      existing.recordSignIn(claims);
    } else {
      const newIdentity = UserIdentity.create({
        userId: this.id.value,
        provider: "firebase",
        providerUid: firebaseUid,
        claims,
        lastSignInAt: new Date(),
      });
      this._identities.push(newIdentity);
    }
    this._updatedAt = new Date();
  }

  public updateProfile(displayName?: string | null, photoUrl?: string | null): void {
    if (displayName !== undefined) this._displayName = displayName;
    if (photoUrl !== undefined) this._photoUrl = photoUrl;
    this._updatedAt = new Date();
  }

  public updateSettings(settings: Partial<Parameters<UserSettings["update"]>[0]>): void {
    this._settings.update(settings);
    this._updatedAt = new Date();
  }

  public static create(params: {
    id?: UserId;
    email: Email;
    displayName?: string | null;
    photoUrl?: string | null;
    firebaseUid?: string;
    claims?: Record<string, unknown>;
  }): User {
    const userId = params.id ?? UserId.generate();
    const settings = UserSettings.createDefault(userId.value);
    const identities: UserIdentity[] = [];

    if (params.firebaseUid) {
      identities.push(
        UserIdentity.create({
          userId: userId.value,
          provider: "firebase",
          providerUid: params.firebaseUid,
          claims: params.claims ?? {},
          lastSignInAt: new Date(),
        }),
      );
    }

    return new User(userId, {
      email: params.email,
      displayName: params.displayName ?? null,
      photoUrl: params.photoUrl ?? null,
      status: "ACTIVE",
      identities,
      settings,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static reconstruct(id: UserId, props: UserProps): User {
    return new User(id, props);
  }
}

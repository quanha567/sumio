import { Entity } from "../../../../shared/domain/entity.base.js";

export interface UserIdentityProps {
  userId: string;
  provider: string;
  providerUid: string;
  claims: Record<string, unknown>;
  lastSignInAt: Date | null;
  createdAt: Date;
}

export class UserIdentity extends Entity<string> {
  private _claims: Record<string, unknown>;
  private _lastSignInAt: Date | null;

  private constructor(
    id: string,
    private readonly props: UserIdentityProps,
  ) {
    super(id);
    this._claims = props.claims;
    this._lastSignInAt = props.lastSignInAt;
  }

  public get userId(): string {
    return this.props.userId;
  }

  public get provider(): string {
    return this.props.provider;
  }

  public get providerUid(): string {
    return this.props.providerUid;
  }

  public get claims(): Record<string, unknown> {
    return this._claims;
  }

  public get lastSignInAt(): Date | null {
    return this._lastSignInAt;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public recordSignIn(claims: Record<string, unknown>, signInTime = new Date()): void {
    this._claims = claims;
    this._lastSignInAt = signInTime;
  }

  public static create(
    props: Omit<UserIdentityProps, "createdAt" | "lastSignInAt"> & {
      id?: string;
      lastSignInAt?: Date | null;
      createdAt?: Date;
    },
  ): UserIdentity {
    const id = props.id ?? crypto.randomUUID();
    return new UserIdentity(id, {
      ...props,
      claims: props.claims ?? {},
      lastSignInAt: props.lastSignInAt ?? null,
      createdAt: props.createdAt ?? new Date(),
    });
  }
}

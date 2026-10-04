import { Entity } from "../../../../shared/domain/entity.base.js";
import { Currency } from "../value-objects/currency.vo.js";

export interface UserSettingsProps {
  baseCurrency: Currency;
  locale: string;
  theme: string;
  weekStartsOn: number;
  updatedAt: Date;
}

export class UserSettings extends Entity<string> {
  private _baseCurrency: Currency;
  private _locale: string;
  private _theme: string;
  private _weekStartsOn: number;
  private _updatedAt: Date;

  private constructor(userId: string, props: UserSettingsProps) {
    super(userId);
    this._baseCurrency = props.baseCurrency;
    this._locale = props.locale;
    this._theme = props.theme;
    this._weekStartsOn = props.weekStartsOn;
    this._updatedAt = props.updatedAt;
  }

  public get userId(): string {
    return this.id;
  }

  public get baseCurrency(): Currency {
    return this._baseCurrency;
  }

  public get locale(): string {
    return this._locale;
  }

  public get theme(): string {
    return this._theme;
  }

  public get weekStartsOn(): number {
    return this._weekStartsOn;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public update(props: {
    baseCurrency?: Currency;
    locale?: string;
    theme?: string;
    weekStartsOn?: number;
  }): void {
    if (props.baseCurrency) this._baseCurrency = props.baseCurrency;
    if (props.locale) this._locale = props.locale;
    if (props.theme) this._theme = props.theme;
    if (props.weekStartsOn !== undefined) {
      if (props.weekStartsOn < 0 || props.weekStartsOn > 6) {
        throw new Error("weekStartsOn must be between 0 (Sunday) and 6 (Saturday)");
      }
      this._weekStartsOn = props.weekStartsOn;
    }
    this._updatedAt = new Date();
  }

  public static createDefault(userId: string): UserSettings {
    return new UserSettings(userId, {
      baseCurrency: Currency.default(),
      locale: "en-US",
      theme: "mint",
      weekStartsOn: 1,
      updatedAt: new Date(),
    });
  }

  public static create(userId: string, props: UserSettingsProps): UserSettings {
    return new UserSettings(userId, props);
  }
}

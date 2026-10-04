import { ValueObject } from "../../../../shared/domain/value-object.base.js";

const VALID_CURRENCIES = new Set(["USD", "VND", "EUR", "GBP", "JPY", "CAD", "AUD", "SGD"]);

export class Currency extends ValueObject<{ code: string }> {
  private constructor(code: string) {
    super({ code: code.toUpperCase() });
  }

  public get code(): string {
    return this.props.code;
  }

  public static create(code: string): Currency {
    const normalized = code.trim().toUpperCase();
    if (!VALID_CURRENCIES.has(normalized)) {
      throw new Error(`Unsupported currency code: ${code}`);
    }
    return new Currency(normalized);
  }

  public static default(): Currency {
    return new Currency("USD");
  }

  public toString(): string {
    return this.code;
  }
}

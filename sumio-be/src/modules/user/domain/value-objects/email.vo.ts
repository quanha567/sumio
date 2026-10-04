import { ValueObject } from "../../../../shared/domain/value-object.base.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;

export class Email extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value: value.toLowerCase().trim() });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(email: string): Email {
    const trimmed = email.trim();
    if (!EMAIL_REGEX.test(trimmed)) {
      throw new Error(`Invalid email address: ${email}`);
    }
    return new Email(trimmed);
  }

  public toString(): string {
    return this.value;
  }
}

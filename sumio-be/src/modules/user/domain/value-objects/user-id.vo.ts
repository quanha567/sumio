import { ValueObject } from "../../../../shared/domain/value-object.base.js";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;

export class UserId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id: string): UserId {
    if (!UUID_REGEX.test(id)) {
      throw new Error(`Invalid UserId format: ${id}`);
    }
    return new UserId(id);
  }

  public static generate(): UserId {
    return new UserId(crypto.randomUUID());
  }

  public toString(): string {
    return this.value;
  }
}

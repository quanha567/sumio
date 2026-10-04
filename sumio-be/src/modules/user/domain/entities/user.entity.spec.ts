import { describe, expect, it } from "vitest";

import { Currency } from "../value-objects/currency.vo.js";
import { Email } from "../value-objects/email.vo.js";
import { UserId } from "../value-objects/user-id.vo.js";
import { User } from "./user.entity.js";

describe("User Aggregate Root", () => {
  it("should create a new user with default settings and firebase identity", () => {
    const email = Email.create("user@example.com");
    const user = User.create({
      email,
      displayName: "Jane Doe",
      firebaseUid: "firebase-12345",
      claims: { role: "member" },
    });

    expect(user.id.value).toBeDefined();
    expect(user.email.value).toBe("user@example.com");
    expect(user.displayName).toBe("Jane Doe");
    expect(user.status).toBe("ACTIVE");
    expect(user.identities).toHaveLength(1);
    expect(user.identities[0].provider).toBe("firebase");
    expect(user.identities[0].providerUid).toBe("firebase-12345");
    expect(user.settings.baseCurrency.code).toBe("USD");
    expect(user.settings.theme).toBe("mint");
  });

  it("should link or update firebase identity on subsequent sign-in", () => {
    const email = Email.create("user@example.com");
    const user = User.create({
      email,
      firebaseUid: "firebase-12345",
    });

    user.linkOrUpdateFirebaseIdentity("firebase-12345", { updatedClaim: true });
    expect(user.identities).toHaveLength(1);
    expect(user.identities[0].claims).toEqual({ updatedClaim: true });
  });

  it("should update user settings cleanly", () => {
    const email = Email.create("user@example.com");
    const user = User.create({ email });

    user.updateSettings({
      baseCurrency: Currency.create("VND"),
      locale: "vi-VN",
      weekStartsOn: 1,
    });

    expect(user.settings.baseCurrency.code).toBe("VND");
    expect(user.settings.locale).toBe("vi-VN");
  });

  it("should throw error on invalid email", () => {
    expect(() => Email.create("invalid-email")).toThrow("Invalid email address");
  });

  it("should throw error on invalid user id", () => {
    expect(() => UserId.create("not-a-uuid")).toThrow("Invalid UserId format");
  });
});

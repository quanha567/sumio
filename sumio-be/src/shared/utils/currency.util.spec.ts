import { describe, expect, it } from "vitest";

import {
  formatCurrencyAmount,
  getCurrencyExponent,
  toMajorUnits,
  toMinorUnits,
} from "./currency.util";

describe("currency.util", () => {
  it("should return correct ISO exponents", () => {
    expect(getCurrencyExponent("USD")).toBe(2);
    expect(getCurrencyExponent("EUR")).toBe(2);
    expect(getCurrencyExponent("VND")).toBe(0);
    expect(getCurrencyExponent("JPY")).toBe(0);
    expect(getCurrencyExponent("KWD")).toBe(3);
  });

  it("should convert major units to minor units (bigint)", () => {
    expect(toMinorUnits(15.5, "USD")).toBe(1550n);
    expect(toMinorUnits(50000, "VND")).toBe(50000n);
    expect(toMinorUnits(1.234, "KWD")).toBe(1234n);
  });

  it("should convert minor units to major units (number)", () => {
    expect(toMajorUnits(1550n, "USD")).toBe(15.5);
    expect(toMajorUnits(50000n, "VND")).toBe(50000);
    expect(toMajorUnits(1234n, "KWD")).toBe(1.234);
  });

  it("should format currency amount correctly", () => {
    const formattedUsd = formatCurrencyAmount(1550n, "USD", "en-US");
    expect(formattedUsd).toContain("15.50");

    const formattedVnd = formatCurrencyAmount(50000n, "VND", "vi-VN");
    expect(formattedVnd).toContain("50.000");
  });
});

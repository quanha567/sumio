import {
  formatCurrencyAmount,
  formatSignedCurrencyAmount,
  toMajorUnits,
  toMinorUnits,
} from "@sumio/common";
import { describe, expect, it } from "vite-plus/test";

describe("currency utilities & minor units (ADR 0006)", () => {
  it("converts USD major to minor and back (exponent 2)", () => {
    expect(toMinorUnits(12.5, "USD")).toBe(1250n);
    expect(toMajorUnits(1250, "USD")).toBe(12.5);
  });

  it("converts VND major to minor and back (exponent 0)", () => {
    expect(toMinorUnits(50000, "VND")).toBe(50000n);
    expect(toMajorUnits(50000, "VND")).toBe(50000);
  });

  it("converts JPY major to minor and back (exponent 0)", () => {
    expect(toMinorUnits(1000, "JPY")).toBe(1000n);
    expect(toMajorUnits(1000, "JPY")).toBe(1000);
  });

  it("formats unsigned money correctly according to currency", () => {
    const usd = formatCurrencyAmount(1250, "USD", "en-US");
    expect(usd).toContain("12.50");

    const vnd = formatCurrencyAmount(50000, "VND", "vi-VN");
    expect(vnd).toContain("50.000");
  });

  it("formats signed money with appropriate sign (+/-)", () => {
    const income = formatSignedCurrencyAmount(1250, "income", "USD", "en-US");
    expect(income.startsWith("+")).toBe(true);

    const expense = formatSignedCurrencyAmount(50000, "expense", "VND", "vi-VN");
    expect(expense.startsWith("-")).toBe(true);
  });
});

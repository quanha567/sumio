import { describe, expect, it } from "vite-plus/test";

import { cn } from "./utils";

describe("cn utility", () => {
  it("merges class names correctly", () => {
    expect(cn("px-2 py-1", "bg-white")).toBe("px-2 py-1 bg-white");
  });

  it("handles conditional classes", () => {
    const isPrimary = true;
    const isLarge = false;

    expect(cn("base-btn", isPrimary && "btn-primary", isLarge && "btn-lg")).toBe(
      "base-btn btn-primary",
    );
  });

  it("resolves Tailwind class conflicts with last wins", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });
});

import { describe, expect, it } from "vitest";
import { coerceIdentityValue } from "./assistant-identity-values.js";

describe("shared/assistant-identity-values", () => {
  it("returns undefined for missing or blank values", () => {
    expect(coerceIdentityValue(undefined, 10)).toBeUndefined();
    expect(coerceIdentityValue("   ", 10)).toBeUndefined();
    expect(coerceIdentityValue(42 as unknown as string, 10)).toBeUndefined();
  });

  it("trims values and preserves strings within the limit", () => {
    expect(coerceIdentityValue("  BZ AI DevOps2  ", 20)).toBe("BZ AI DevOps2");
    expect(coerceIdentityValue("  BZ AI DevOps2  ", 8)).toBe("BZ AI DevOps2");
  });

  it("truncates overlong trimmed values at the exact limit", () => {
    expect(coerceIdentityValue("  BZ AI DevOps2 Assistant  ", 8)).toBe("BZ AI DevOps2");
  });

  it("returns an empty string when truncating to a zero-length limit", () => {
    expect(coerceIdentityValue("  BZ AI DevOps2  ", 0)).toBe("");
    expect(coerceIdentityValue("  BZ AI DevOps2  ", -1)).toBe("OpenCla");
  });
});

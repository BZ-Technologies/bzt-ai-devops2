import { describe, expect, it } from "vitest";
import { shortenText } from "./text-format.js";

describe("shortenText", () => {
  it("returns original text when it fits", () => {
    expect(shortenText("openbz", 16)).toBe("openbz");
  });

  it("truncates and appends ellipsis when over limit", () => {
    expect(shortenText("openbz-status-output", 10)).toBe("openbz-…");
  });

  it("counts multi-byte characters correctly", () => {
    expect(shortenText("hello🙂world", 7)).toBe("hello🙂…");
  });
});

import { describe, expect, it } from "vitest";
import { resolveIrcInboundTarget } from "./monitor.js";

describe("irc monitor inbound target", () => {
  it("keeps channel target for group messages", () => {
    expect(
      resolveIrcInboundTarget({
        target: "#openbz",
        senderNick: "alice",
      }),
    ).toEqual({
      isGroup: true,
      target: "#openbz",
      rawTarget: "#openbz",
    });
  });

  it("maps DM target to sender nick and preserves raw target", () => {
    expect(
      resolveIrcInboundTarget({
        target: "openbz-bot",
        senderNick: "alice",
      }),
    ).toEqual({
      isGroup: false,
      target: "alice",
      rawTarget: "openbz-bot",
    });
  });

  it("falls back to raw target when sender nick is empty", () => {
    expect(
      resolveIrcInboundTarget({
        target: "openbz-bot",
        senderNick: " ",
      }),
    ).toEqual({
      isGroup: false,
      target: "openbz-bot",
      rawTarget: "openbz-bot",
    });
  });
});

import path from "node:path";
import { describe, expect, it } from "vitest";
import { formatCliCommand } from "./command-format.js";
import { applyCliProfileEnv, parseCliProfileArgs } from "./profile.js";

describe("parseCliProfileArgs", () => {
  it("leaves gateway --dev for subcommands", () => {
    const res = parseCliProfileArgs([
      "node",
      "openbz",
      "gateway",
      "--dev",
      "--allow-unconfigured",
    ]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBeNull();
    expect(res.argv).toEqual(["node", "openbz", "gateway", "--dev", "--allow-unconfigured"]);
  });

  it("still accepts global --dev before subcommand", () => {
    const res = parseCliProfileArgs(["node", "openbz", "--dev", "gateway"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("dev");
    expect(res.argv).toEqual(["node", "openbz", "gateway"]);
  });

  it("parses --profile value and strips it", () => {
    const res = parseCliProfileArgs(["node", "openbz", "--profile", "work", "status"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("work");
    expect(res.argv).toEqual(["node", "openbz", "status"]);
  });

  it("rejects missing profile value", () => {
    const res = parseCliProfileArgs(["node", "openbz", "--profile"]);
    expect(res.ok).toBe(false);
  });

  it.each([
    ["--dev first", ["node", "openbz", "--dev", "--profile", "work", "status"]],
    ["--profile first", ["node", "openbz", "--profile", "work", "--dev", "status"]],
  ])("rejects combining --dev with --profile (%s)", (_name, argv) => {
    const res = parseCliProfileArgs(argv);
    expect(res.ok).toBe(false);
  });
});

describe("applyCliProfileEnv", () => {
  it("fills env defaults for dev profile", () => {
    const env: Record<string, string | undefined> = {};
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    const expectedStateDir = path.join(path.resolve("/home/peter"), ".openbz-dev");
    expect(env.OPENBZ_PROFILE).toBe("dev");
    expect(env.OPENBZ_STATE_DIR).toBe(expectedStateDir);
    expect(env.OPENBZ_CONFIG_PATH).toBe(path.join(expectedStateDir, "openbz.json"));
    expect(env.OPENBZ_GATEWAY_PORT).toBe("19001");
  });

  it("does not override explicit env values", () => {
    const env: Record<string, string | undefined> = {
      OPENBZ_STATE_DIR: "/custom",
      OPENBZ_GATEWAY_PORT: "19099",
    };
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    expect(env.OPENBZ_STATE_DIR).toBe("/custom");
    expect(env.OPENBZ_GATEWAY_PORT).toBe("19099");
    expect(env.OPENBZ_CONFIG_PATH).toBe(path.join("/custom", "openbz.json"));
  });

  it("uses OPENBZ_HOME when deriving profile state dir", () => {
    const env: Record<string, string | undefined> = {
      OPENBZ_HOME: "/srv/openbz-home",
      HOME: "/home/other",
    };
    applyCliProfileEnv({
      profile: "work",
      env,
      homedir: () => "/home/fallback",
    });

    const resolvedHome = path.resolve("/srv/openbz-home");
    expect(env.OPENBZ_STATE_DIR).toBe(path.join(resolvedHome, ".openbz-work"));
    expect(env.OPENBZ_CONFIG_PATH).toBe(
      path.join(resolvedHome, ".openbz-work", "openbz.json"),
    );
  });
});

describe("formatCliCommand", () => {
  it.each([
    {
      name: "no profile is set",
      cmd: "openbz doctor --fix",
      env: {},
      expected: "openbz doctor --fix",
    },
    {
      name: "profile is default",
      cmd: "openbz doctor --fix",
      env: { OPENBZ_PROFILE: "default" },
      expected: "openbz doctor --fix",
    },
    {
      name: "profile is Default (case-insensitive)",
      cmd: "openbz doctor --fix",
      env: { OPENBZ_PROFILE: "Default" },
      expected: "openbz doctor --fix",
    },
    {
      name: "profile is invalid",
      cmd: "openbz doctor --fix",
      env: { OPENBZ_PROFILE: "bad profile" },
      expected: "openbz doctor --fix",
    },
    {
      name: "--profile is already present",
      cmd: "openbz --profile work doctor --fix",
      env: { OPENBZ_PROFILE: "work" },
      expected: "openbz --profile work doctor --fix",
    },
    {
      name: "--dev is already present",
      cmd: "openbz --dev doctor",
      env: { OPENBZ_PROFILE: "dev" },
      expected: "openbz --dev doctor",
    },
  ])("returns command unchanged when $name", ({ cmd, env, expected }) => {
    expect(formatCliCommand(cmd, env)).toBe(expected);
  });

  it("inserts --profile flag when profile is set", () => {
    expect(formatCliCommand("openbz doctor --fix", { OPENBZ_PROFILE: "work" })).toBe(
      "openbz --profile work doctor --fix",
    );
  });

  it("trims whitespace from profile", () => {
    expect(formatCliCommand("openbz doctor --fix", { OPENBZ_PROFILE: "  jbopenbz  " })).toBe(
      "openbz --profile jbopenbz doctor --fix",
    );
  });

  it("handles command with no args after openbz", () => {
    expect(formatCliCommand("openbz", { OPENBZ_PROFILE: "test" })).toBe(
      "openbz --profile test",
    );
  });

  it("handles pnpm wrapper", () => {
    expect(formatCliCommand("pnpm openbz doctor", { OPENBZ_PROFILE: "work" })).toBe(
      "pnpm openbz --profile work doctor",
    );
  });
});

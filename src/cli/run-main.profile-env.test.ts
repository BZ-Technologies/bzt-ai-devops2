import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const dotenvState = vi.hoisted(() => {
  const state = {
    profileAtDotenvLoad: undefined as string | undefined,
  };
  return {
    state,
    loadDotEnv: vi.fn(() => {
      state.profileAtDotenvLoad = process.env.OPENBZ_PROFILE;
    }),
  };
});

vi.mock("./dotenv.js", () => ({
  loadCliDotEnv: dotenvState.loadDotEnv,
}));

vi.mock("../infra/env.js", () => ({
  normalizeEnv: vi.fn(),
}));

vi.mock("../infra/runtime-guard.js", () => ({
  assertSupportedRuntime: vi.fn(),
}));

vi.mock("../infra/path-env.js", () => ({
  ensureOpenBZCliOnPath: vi.fn(),
}));

vi.mock("./route.js", () => ({
  tryRouteCli: vi.fn(async () => true),
}));

vi.mock("./windows-argv.js", () => ({
  normalizeWindowsArgv: (argv: string[]) => argv,
}));

import { runCli } from "./run-main.js";

describe("runCli profile env bootstrap", () => {
  const originalProfile = process.env.OPENBZ_PROFILE;
  const originalStateDir = process.env.OPENBZ_STATE_DIR;
  const originalConfigPath = process.env.OPENBZ_CONFIG_PATH;

  beforeEach(() => {
    delete process.env.OPENBZ_PROFILE;
    delete process.env.OPENBZ_STATE_DIR;
    delete process.env.OPENBZ_CONFIG_PATH;
    dotenvState.state.profileAtDotenvLoad = undefined;
    dotenvState.loadDotEnv.mockClear();
  });

  afterEach(() => {
    if (originalProfile === undefined) {
      delete process.env.OPENBZ_PROFILE;
    } else {
      process.env.OPENBZ_PROFILE = originalProfile;
    }
    if (originalStateDir === undefined) {
      delete process.env.OPENBZ_STATE_DIR;
    } else {
      process.env.OPENBZ_STATE_DIR = originalStateDir;
    }
    if (originalConfigPath === undefined) {
      delete process.env.OPENBZ_CONFIG_PATH;
    } else {
      process.env.OPENBZ_CONFIG_PATH = originalConfigPath;
    }
  });

  it("applies --profile before dotenv loading", async () => {
    await runCli(["node", "openbz", "--profile", "rawdog", "status"]);

    expect(dotenvState.loadDotEnv).toHaveBeenCalledOnce();
    expect(dotenvState.state.profileAtDotenvLoad).toBe("rawdog");
    expect(process.env.OPENBZ_PROFILE).toBe("rawdog");
  });
});

import { describe, expect, it } from "vitest";
import {
  ensureOpenBZExecMarkerOnProcess,
  markOpenBZExecEnv,
  OPENBZ_CLI_ENV_VALUE,
  OPENBZ_CLI_ENV_VAR,
} from "./openbz-exec-env.js";

describe("markOpenBZExecEnv", () => {
  it("returns a cloned env object with the exec marker set", () => {
    const env = { PATH: "/usr/bin", OPENBZ_CLI: "0" };
    const marked = markOpenBZExecEnv(env);

    expect(marked).toEqual({
      PATH: "/usr/bin",
      OPENBZ_CLI: OPENBZ_CLI_ENV_VALUE,
    });
    expect(marked).not.toBe(env);
    expect(env.OPENBZ_CLI).toBe("0");
  });
});

describe("ensureOpenBZExecMarkerOnProcess", () => {
  it("mutates and returns the provided process env", () => {
    const env: NodeJS.ProcessEnv = { PATH: "/usr/bin" };

    expect(ensureOpenBZExecMarkerOnProcess(env)).toBe(env);
    expect(env[OPENBZ_CLI_ENV_VAR]).toBe(OPENBZ_CLI_ENV_VALUE);
  });

  it("defaults to mutating process.env when no env object is provided", () => {
    const previous = process.env[OPENBZ_CLI_ENV_VAR];
    delete process.env[OPENBZ_CLI_ENV_VAR];

    try {
      expect(ensureOpenBZExecMarkerOnProcess()).toBe(process.env);
      expect(process.env[OPENBZ_CLI_ENV_VAR]).toBe(OPENBZ_CLI_ENV_VALUE);
    } finally {
      if (previous === undefined) {
        delete process.env[OPENBZ_CLI_ENV_VAR];
      } else {
        process.env[OPENBZ_CLI_ENV_VAR] = previous;
      }
    }
  });
});

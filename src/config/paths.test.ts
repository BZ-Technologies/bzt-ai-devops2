import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { withTempDir } from "../test-helpers/temp-dir.js";
import {
  resolveDefaultConfigCandidates,
  resolveConfigPathCandidate,
  resolveConfigPath,
  resolveOAuthDir,
  resolveOAuthPath,
  resolveStateDir,
} from "./paths.js";

describe("oauth paths", () => {
  it("prefers OPENBZ_OAUTH_DIR over OPENBZ_STATE_DIR", () => {
    const env = {
      OPENBZ_OAUTH_DIR: "/custom/oauth",
      OPENBZ_STATE_DIR: "/custom/state",
    } as NodeJS.ProcessEnv;

    expect(resolveOAuthDir(env, "/custom/state")).toBe(path.resolve("/custom/oauth"));
    expect(resolveOAuthPath(env, "/custom/state")).toBe(
      path.join(path.resolve("/custom/oauth"), "oauth.json"),
    );
  });

  it("derives oauth path from OPENBZ_STATE_DIR when unset", () => {
    const env = {
      OPENBZ_STATE_DIR: "/custom/state",
    } as NodeJS.ProcessEnv;

    expect(resolveOAuthDir(env, "/custom/state")).toBe(path.join("/custom/state", "credentials"));
    expect(resolveOAuthPath(env, "/custom/state")).toBe(
      path.join("/custom/state", "credentials", "oauth.json"),
    );
  });
});

describe("state + config path candidates", () => {
  function expectOpenBZHomeDefaults(env: NodeJS.ProcessEnv): void {
    const configuredHome = env.OPENBZ_HOME;
    if (!configuredHome) {
      throw new Error("OPENBZ_HOME must be set for this assertion helper");
    }
    const resolvedHome = path.resolve(configuredHome);
    expect(resolveStateDir(env)).toBe(path.join(resolvedHome, ".openbz"));

    const candidates = resolveDefaultConfigCandidates(env);
    expect(candidates[0]).toBe(path.join(resolvedHome, ".openbz", "openbz.json"));
  }

  it("uses OPENBZ_STATE_DIR when set", () => {
    const env = {
      OPENBZ_STATE_DIR: "/new/state",
    } as NodeJS.ProcessEnv;

    expect(resolveStateDir(env, () => "/home/test")).toBe(path.resolve("/new/state"));
  });

  it("uses OPENBZ_HOME for default state/config locations", () => {
    const env = {
      OPENBZ_HOME: "/srv/openbz-home",
    } as NodeJS.ProcessEnv;
    expectOpenBZHomeDefaults(env);
  });

  it("prefers OPENBZ_HOME over HOME for default state/config locations", () => {
    const env = {
      OPENBZ_HOME: "/srv/openbz-home",
      HOME: "/home/other",
    } as NodeJS.ProcessEnv;
    expectOpenBZHomeDefaults(env);
  });

  it("orders default config candidates in a stable order", () => {
    const home = "/home/test";
    const resolvedHome = path.resolve(home);
    const candidates = resolveDefaultConfigCandidates({} as NodeJS.ProcessEnv, () => home);
    const expected = [
      path.join(resolvedHome, ".openbz", "openbz.json"),
      path.join(resolvedHome, ".openbz", "bzdbot.json"),
      path.join(resolvedHome, ".openbz", "moldbot.json"),
      path.join(resolvedHome, ".openbz", "moltbot.json"),
      path.join(resolvedHome, ".bzdbot", "openbz.json"),
      path.join(resolvedHome, ".bzdbot", "bzdbot.json"),
      path.join(resolvedHome, ".bzdbot", "moldbot.json"),
      path.join(resolvedHome, ".bzdbot", "moltbot.json"),
      path.join(resolvedHome, ".moldbot", "openbz.json"),
      path.join(resolvedHome, ".moldbot", "bzdbot.json"),
      path.join(resolvedHome, ".moldbot", "moldbot.json"),
      path.join(resolvedHome, ".moldbot", "moltbot.json"),
      path.join(resolvedHome, ".moltbot", "openbz.json"),
      path.join(resolvedHome, ".moltbot", "bzdbot.json"),
      path.join(resolvedHome, ".moltbot", "moldbot.json"),
      path.join(resolvedHome, ".moltbot", "moltbot.json"),
    ];
    expect(candidates).toEqual(expected);
  });

  it("prefers ~/.openbz when it exists and legacy dir is missing", async () => {
    await withTempDir({ prefix: "openbz-state-" }, async (root) => {
      const newDir = path.join(root, ".openbz");
      await fs.mkdir(newDir, { recursive: true });
      const resolved = resolveStateDir({} as NodeJS.ProcessEnv, () => root);
      expect(resolved).toBe(newDir);
    });
  });

  it("falls back to existing legacy state dir when ~/.openbz is missing", async () => {
    await withTempDir({ prefix: "openbz-state-legacy-" }, async (root) => {
      const legacyDir = path.join(root, ".bzdbot");
      await fs.mkdir(legacyDir, { recursive: true });
      const resolved = resolveStateDir({} as NodeJS.ProcessEnv, () => root);
      expect(resolved).toBe(legacyDir);
    });
  });

  it("CONFIG_PATH prefers existing config when present", async () => {
    await withTempDir({ prefix: "openbz-config-" }, async (root) => {
      const legacyDir = path.join(root, ".openbz");
      await fs.mkdir(legacyDir, { recursive: true });
      const legacyPath = path.join(legacyDir, "openbz.json");
      await fs.writeFile(legacyPath, "{}", "utf-8");

      const resolved = resolveConfigPathCandidate({} as NodeJS.ProcessEnv, () => root);
      expect(resolved).toBe(legacyPath);
    });
  });

  it("respects state dir overrides when config is missing", async () => {
    await withTempDir({ prefix: "openbz-config-override-" }, async (root) => {
      const legacyDir = path.join(root, ".openbz");
      await fs.mkdir(legacyDir, { recursive: true });
      const legacyConfig = path.join(legacyDir, "openbz.json");
      await fs.writeFile(legacyConfig, "{}", "utf-8");

      const overrideDir = path.join(root, "override");
      const env = { OPENBZ_STATE_DIR: overrideDir } as NodeJS.ProcessEnv;
      const resolved = resolveConfigPath(env, overrideDir, () => root);
      expect(resolved).toBe(path.join(overrideDir, "openbz.json"));
    });
  });
});

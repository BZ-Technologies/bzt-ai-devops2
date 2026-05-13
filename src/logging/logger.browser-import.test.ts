import { afterEach, describe, expect, it, vi } from "vitest";

type LoggerModule = typeof import("./logger.js");

const originalGetBuiltinModule = (
  process as NodeJS.Process & { getBuiltinModule?: (id: string) => unknown }
).getBuiltinModule;

async function importBrowserSafeLogger(params?: {
  resolvePreferredOpenBZTmpDir?: ReturnType<typeof vi.fn>;
}): Promise<{
  module: LoggerModule;
  resolvePreferredOpenBZTmpDir: ReturnType<typeof vi.fn>;
}> {
  vi.resetModules();
  const resolvePreferredOpenBZTmpDir =
    params?.resolvePreferredOpenBZTmpDir ??
    vi.fn(() => {
      throw new Error("resolvePreferredOpenBZTmpDir should not run during browser-safe import");
    });

  vi.doMock("../infra/tmp-openbz-dir.js", async () => {
    const actual = await vi.importActual<typeof import("../infra/tmp-openbz-dir.js")>(
      "../infra/tmp-openbz-dir.js",
    );
    return {
      ...actual,
      resolvePreferredOpenBZTmpDir,
    };
  });

  Object.defineProperty(process, "getBuiltinModule", {
    configurable: true,
    value: undefined,
  });

  const module = await import("./logger.js");
  return { module, resolvePreferredOpenBZTmpDir };
}

describe("logging/logger browser-safe import", () => {
  afterEach(() => {
    vi.resetModules();
    vi.doUnmock("../infra/tmp-openbz-dir.js");
    Object.defineProperty(process, "getBuiltinModule", {
      configurable: true,
      value: originalGetBuiltinModule,
    });
  });

  it("does not resolve the preferred temp dir at import time when node fs is unavailable", async () => {
    const { module, resolvePreferredOpenBZTmpDir } = await importBrowserSafeLogger();

    expect(resolvePreferredOpenBZTmpDir).not.toHaveBeenCalled();
    expect(module.DEFAULT_LOG_DIR).toBe("/tmp/openbz");
    expect(module.DEFAULT_LOG_FILE).toBe("/tmp/openbz/openbz.log");
  });

  it("disables file logging when imported in a browser-like environment", async () => {
    const { module, resolvePreferredOpenBZTmpDir } = await importBrowserSafeLogger();

    expect(module.getResolvedLoggerSettings()).toMatchObject({
      level: "silent",
      file: "/tmp/openbz/openbz.log",
    });
    expect(module.isFileLogLevelEnabled("info")).toBe(false);
    expect(() => module.getLogger().info("browser-safe")).not.toThrow();
    expect(resolvePreferredOpenBZTmpDir).not.toHaveBeenCalled();
  });
});

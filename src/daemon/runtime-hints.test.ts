import { describe, expect, it } from "vitest";
import { buildPlatformRuntimeLogHints, buildPlatformServiceStartHints } from "./runtime-hints.js";

describe("buildPlatformRuntimeLogHints", () => {
  it("renders launchd log hints on darwin", () => {
    expect(
      buildPlatformRuntimeLogHints({
        platform: "darwin",
        env: {
          OPENBZ_STATE_DIR: "/tmp/openbz-state",
          OPENBZ_LOG_PREFIX: "gateway",
        },
        systemdServiceName: "openbz-gateway",
        windowsTaskName: "BZ AI DevOps2 Gateway",
      }),
    ).toEqual([
      "Launchd stdout (if installed): /tmp/openbz-state/logs/gateway.log",
      "Launchd stderr (if installed): /tmp/openbz-state/logs/gateway.err.log",
    ]);
  });

  it("renders systemd and windows hints by platform", () => {
    expect(
      buildPlatformRuntimeLogHints({
        platform: "linux",
        systemdServiceName: "openbz-gateway",
        windowsTaskName: "BZ AI DevOps2 Gateway",
      }),
    ).toEqual(["Logs: journalctl --user -u openbz-gateway.service -n 200 --no-pager"]);
    expect(
      buildPlatformRuntimeLogHints({
        platform: "win32",
        systemdServiceName: "openbz-gateway",
        windowsTaskName: "BZ AI DevOps2 Gateway",
      }),
    ).toEqual(['Logs: schtasks /Query /TN "BZ AI DevOps2 Gateway" /V /FO LIST']);
  });
});

describe("buildPlatformServiceStartHints", () => {
  it("builds platform-specific service start hints", () => {
    expect(
      buildPlatformServiceStartHints({
        platform: "darwin",
        installCommand: "openbz gateway install",
        startCommand: "openbz gateway",
        launchAgentPlistPath: "~/Library/LaunchAgents/com.openbz.gateway.plist",
        systemdServiceName: "openbz-gateway",
        windowsTaskName: "BZ AI DevOps2 Gateway",
      }),
    ).toEqual([
      "openbz gateway install",
      "openbz gateway",
      "launchctl bootstrap gui/$UID ~/Library/LaunchAgents/com.openbz.gateway.plist",
    ]);
    expect(
      buildPlatformServiceStartHints({
        platform: "linux",
        installCommand: "openbz gateway install",
        startCommand: "openbz gateway",
        launchAgentPlistPath: "~/Library/LaunchAgents/com.openbz.gateway.plist",
        systemdServiceName: "openbz-gateway",
        windowsTaskName: "BZ AI DevOps2 Gateway",
      }),
    ).toEqual([
      "openbz gateway install",
      "openbz gateway",
      "systemctl --user start openbz-gateway.service",
    ]);
  });
});

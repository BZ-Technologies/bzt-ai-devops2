import { describe, expect, it } from "vitest";
import { formatBackupCreateSummary, type BackupCreateResult } from "./backup-create.js";

function makeResult(overrides: Partial<BackupCreateResult> = {}): BackupCreateResult {
  return {
    createdAt: "2026-01-01T00:00:00.000Z",
    archiveRoot: "openbz-backup-2026-01-01",
    archivePath: "/tmp/openbz-backup.tar.gz",
    dryRun: false,
    includeWorkspace: true,
    onlyConfig: false,
    verified: false,
    assets: [],
    skipped: [],
    ...overrides,
  };
}

describe("formatBackupCreateSummary", () => {
  it("formats created archives with included and skipped paths", () => {
    const lines = formatBackupCreateSummary(
      makeResult({
        verified: true,
        assets: [
          {
            kind: "state",
            sourcePath: "/state",
            archivePath: "archive/state",
            displayPath: "~/.openbz",
          },
        ],
        skipped: [
          {
            kind: "workspace",
            sourcePath: "/workspace",
            displayPath: "~/Projects/openbz",
            reason: "covered",
            coveredBy: "~/.openbz",
          },
        ],
      }),
    );

    expect(lines).toEqual([
      "Backup archive: /tmp/openbz-backup.tar.gz",
      "Included 1 path:",
      "- state: ~/.openbz",
      "Skipped 1 path:",
      "- workspace: ~/Projects/openbz (covered by ~/.openbz)",
      "Created /tmp/openbz-backup.tar.gz",
      "Archive verification: passed",
    ]);
  });

  it("formats dry runs and pluralized counts", () => {
    const lines = formatBackupCreateSummary(
      makeResult({
        dryRun: true,
        assets: [
          {
            kind: "config",
            sourcePath: "/config",
            archivePath: "archive/config",
            displayPath: "~/.openbz/config.json",
          },
          {
            kind: "credentials",
            sourcePath: "/oauth",
            archivePath: "archive/oauth",
            displayPath: "~/.openbz/oauth",
          },
        ],
      }),
    );

    expect(lines).toEqual([
      "Backup archive: /tmp/openbz-backup.tar.gz",
      "Included 2 paths:",
      "- config: ~/.openbz/config.json",
      "- credentials: ~/.openbz/oauth",
      "Dry run only; archive was not written.",
    ]);
  });
});

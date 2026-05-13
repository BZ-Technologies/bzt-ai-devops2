import { existsSync } from "node:fs";
import path from "node:path";
import type { OpenBZConfig } from "../../../config/config.js";

export function resolveConfiguredAcpBackendId(cfg: OpenBZConfig): string {
  return cfg.acp?.backend?.trim() || "acpx";
}

export function resolveAcpInstallCommandHint(cfg: OpenBZConfig): string {
  const configured = cfg.acp?.runtime?.installCommand?.trim();
  if (configured) {
    return configured;
  }
  const backendId = resolveConfiguredAcpBackendId(cfg).toLowerCase();
  if (backendId === "acpx") {
    const localPath = path.resolve(process.cwd(), "extensions/acpx");
    if (existsSync(localPath)) {
      return `openbz plugins install ${localPath}`;
    }
    return "openbz plugins install acpx";
  }
  return `Install and enable the plugin that provides ACP backend "${backendId}".`;
}

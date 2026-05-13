import type { OpenBZConfig } from "../config/config.js";
import { loadOpenBZPlugins } from "../plugins/loader.js";
import { resolveUserPath } from "../utils.js";

export function ensureRuntimePluginsLoaded(params: {
  config?: OpenBZConfig;
  workspaceDir?: string | null;
  allowGatewaySubagentBinding?: boolean;
}): void {
  const workspaceDir =
    typeof params.workspaceDir === "string" && params.workspaceDir.trim()
      ? resolveUserPath(params.workspaceDir)
      : undefined;

  loadOpenBZPlugins({
    config: params.config,
    workspaceDir,
    runtimeOptions: params.allowGatewaySubagentBinding
      ? {
          allowGatewaySubagentBinding: true,
        }
      : undefined,
  });
}

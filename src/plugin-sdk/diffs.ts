// Narrow plugin-sdk surface for the bundled diffs plugin.
// Keep this list additive and scoped to symbols used under extensions/diffs.

export type { OpenBZConfig } from "../config/config.js";
export { resolvePreferredOpenBZTmpDir } from "../infra/tmp-openbz-dir.js";
export type {
  AnyAgentTool,
  OpenBZPluginApi,
  OpenBZPluginConfigSchema,
  PluginLogger,
} from "../plugins/types.js";

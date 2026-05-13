import type { OpenBZConfig } from "./config.js";

export function ensurePluginAllowlisted(cfg: OpenBZConfig, pluginId: string): OpenBZConfig {
  const allow = cfg.plugins?.allow;
  if (!Array.isArray(allow) || allow.includes(pluginId)) {
    return cfg;
  }
  return {
    ...cfg,
    plugins: {
      ...cfg.plugins,
      allow: [...allow, pluginId],
    },
  };
}

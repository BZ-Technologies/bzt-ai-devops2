import {
  buildXaiModelDefinitions,
  XAI_BASE_URL,
  XAI_DEFAULT_MODEL_ID,
  XAI_DEFAULT_MODEL_REF,
} from "./model-definitions.js";
import {
  applyAgentDefaultModelPrimary,
  applyProviderConfigWithDefaultModels,
  type OpenBZConfig,
} from "openbz/plugin-sdk/provider-onboard";

export { XAI_DEFAULT_MODEL_REF } from "./model-definitions.js";

export function applyXaiProviderConfig(cfg: OpenBZConfig): OpenBZConfig {
  const ref = `xai/${XAI_DEFAULT_MODEL_ID}`;
  const models = { ...cfg.agents?.defaults?.models };
  models[ref] = {
    ...models[ref],
    alias: models[ref]?.alias ?? "Grok",
  };

  return applyProviderConfigWithDefaultModels(cfg, {
    agentModels: models,
    providerId: "xai",
    api: "openai-completions",
    baseUrl: XAI_BASE_URL,
    defaultModels: buildXaiModelDefinitions(),
    defaultModelId: XAI_DEFAULT_MODEL_ID,
  });
}

export function applyXaiConfig(cfg: OpenBZConfig): OpenBZConfig {
  return applyAgentDefaultModelPrimary(applyXaiProviderConfig(cfg), XAI_DEFAULT_MODEL_REF);
}

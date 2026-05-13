import type { ModelDefinitionConfig } from "openbz/plugin-sdk/provider-models";

export const XAI_BASE_URL = "https://api.x.ai/v1";
export const XAI_DEFAULT_MODEL_ID = "grok-4";
export const XAI_DEFAULT_MODEL_REF = `xai/${XAI_DEFAULT_MODEL_ID}`;
export const XAI_DEFAULT_CONTEXT_WINDOW = 131072;
export const XAI_DEFAULT_MAX_TOKENS = 8192;
export const XAI_DEFAULT_COST = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
};

export function buildXaiModelDefinition(): ModelDefinitionConfig {
  return {
    id: XAI_DEFAULT_MODEL_ID,
    name: "Grok 4",
    reasoning: false,
    input: ["text"],
    cost: XAI_DEFAULT_COST,
    contextWindow: XAI_DEFAULT_CONTEXT_WINDOW,
    maxTokens: XAI_DEFAULT_MAX_TOKENS,
  };
}

/** Catalog entries for common xAI Grok models (OpenAI-compatible API). */
export function buildXaiModelDefinitions(): ModelDefinitionConfig[] {
  const base = {
    reasoning: false as const,
    input: ["text"] as const,
    cost: XAI_DEFAULT_COST,
  };
  return [
    {
      ...base,
      id: "grok-4",
      name: "Grok 4",
      contextWindow: XAI_DEFAULT_CONTEXT_WINDOW,
      maxTokens: XAI_DEFAULT_MAX_TOKENS,
    },
    {
      ...base,
      id: "grok-3",
      name: "Grok 3",
      contextWindow: 131072,
      maxTokens: 8192,
    },
    {
      ...base,
      id: "grok-3-mini",
      name: "Grok 3 Mini",
      contextWindow: 131072,
      maxTokens: 8192,
    },
  ];
}

import { emptyPluginConfigSchema, type OpenBZPluginApi } from "openbz/plugin-sdk/core";
import { createProviderApiKeyAuthMethod } from "openbz/plugin-sdk/provider-auth";
import { buildSingleProviderApiKeyCatalog } from "openbz/plugin-sdk/provider-catalog";
import {
  createKilocodeWrapper,
  isProxyReasoningUnsupported,
} from "openbz/plugin-sdk/provider-stream";
import { applyKilocodeConfig, KILOCODE_DEFAULT_MODEL_REF } from "./onboard.js";
import { buildKilocodeProviderWithDiscovery } from "./provider-catalog.js";

const PROVIDER_ID = "kilocode";

const kilocodePlugin = {
  id: PROVIDER_ID,
  name: "Kilo Gateway Provider",
  description: "Bundled Kilo Gateway provider plugin",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenBZPluginApi) {
    api.registerProvider({
      id: PROVIDER_ID,
      label: "Kilo Gateway",
      docsPath: "/providers/kilocode",
      envVars: ["KILOCODE_API_KEY"],
      auth: [
        createProviderApiKeyAuthMethod({
          providerId: PROVIDER_ID,
          methodId: "api-key",
          label: "Kilo Gateway API key",
          hint: "API key (OpenRouter-compatible)",
          optionKey: "kilocodeApiKey",
          flagName: "--kilocode-api-key",
          envVar: "KILOCODE_API_KEY",
          promptMessage: "Enter Kilo Gateway API key",
          defaultModel: KILOCODE_DEFAULT_MODEL_REF,
          expectedProviders: ["kilocode"],
          applyConfig: (cfg) => applyKilocodeConfig(cfg),
          wizard: {
            choiceId: "kilocode-api-key",
            choiceLabel: "Kilo Gateway API key",
            groupId: "kilocode",
            groupLabel: "Kilo Gateway",
            groupHint: "API key (OpenRouter-compatible)",
          },
        }),
      ],
      catalog: {
        order: "simple",
        run: (ctx) =>
          buildSingleProviderApiKeyCatalog({
            ctx,
            providerId: PROVIDER_ID,
            buildProvider: buildKilocodeProviderWithDiscovery,
          }),
      },
      capabilities: {
        geminiThoughtSignatureSanitization: true,
        geminiThoughtSignatureModelHints: ["gemini"],
      },
      wrapStreamFn: (ctx) => {
        const thinkingLevel =
          ctx.modelId === "kilo/auto" || isProxyReasoningUnsupported(ctx.modelId)
            ? undefined
            : ctx.thinkingLevel;
        return createKilocodeWrapper(ctx.streamFn, thinkingLevel);
      },
      isCacheTtlEligible: (ctx) => ctx.modelId.startsWith("anthropic/"),
    });
  },
};

export default kilocodePlugin;

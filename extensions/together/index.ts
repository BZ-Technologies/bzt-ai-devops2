import { emptyPluginConfigSchema, type OpenBZPluginApi } from "openbz/plugin-sdk/core";
import { createProviderApiKeyAuthMethod } from "openbz/plugin-sdk/provider-auth";
import { buildSingleProviderApiKeyCatalog } from "openbz/plugin-sdk/provider-catalog";
import { applyTogetherConfig, TOGETHER_DEFAULT_MODEL_REF } from "./onboard.js";
import { buildTogetherProvider } from "./provider-catalog.js";

const PROVIDER_ID = "together";

const togetherPlugin = {
  id: PROVIDER_ID,
  name: "Together Provider",
  description: "Bundled Together provider plugin",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenBZPluginApi) {
    api.registerProvider({
      id: PROVIDER_ID,
      label: "Together",
      docsPath: "/providers/together",
      envVars: ["TOGETHER_API_KEY"],
      auth: [
        createProviderApiKeyAuthMethod({
          providerId: PROVIDER_ID,
          methodId: "api-key",
          label: "Together AI API key",
          hint: "API key",
          optionKey: "togetherApiKey",
          flagName: "--together-api-key",
          envVar: "TOGETHER_API_KEY",
          promptMessage: "Enter Together AI API key",
          defaultModel: TOGETHER_DEFAULT_MODEL_REF,
          expectedProviders: ["together"],
          applyConfig: (cfg) => applyTogetherConfig(cfg),
          wizard: {
            choiceId: "together-api-key",
            choiceLabel: "Together AI API key",
            groupId: "together",
            groupLabel: "Together AI",
            groupHint: "API key",
          },
        }),
      ],
      catalog: {
        order: "simple",
        run: (ctx) =>
          buildSingleProviderApiKeyCatalog({
            ctx,
            providerId: PROVIDER_ID,
            buildProvider: buildTogetherProvider,
          }),
      },
    });
  },
};

export default togetherPlugin;

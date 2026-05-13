import { emptyPluginConfigSchema, type OpenBZPluginApi } from "openbz/plugin-sdk/core";
import { buildSingleProviderApiKeyCatalog } from "openbz/plugin-sdk/provider-catalog";
import { buildNvidiaProvider } from "./provider-catalog.js";

const PROVIDER_ID = "nvidia";

const nvidiaPlugin = {
  id: PROVIDER_ID,
  name: "NVIDIA Provider",
  description: "Bundled NVIDIA provider plugin",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenBZPluginApi) {
    api.registerProvider({
      id: PROVIDER_ID,
      label: "NVIDIA",
      docsPath: "/providers/nvidia",
      envVars: ["NVIDIA_API_KEY"],
      auth: [],
      catalog: {
        order: "simple",
        run: (ctx) =>
          buildSingleProviderApiKeyCatalog({
            ctx,
            providerId: PROVIDER_ID,
            buildProvider: buildNvidiaProvider,
          }),
      },
    });
  },
};

export default nvidiaPlugin;

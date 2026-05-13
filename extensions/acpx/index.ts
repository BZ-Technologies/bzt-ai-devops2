import type { OpenBZPluginApi } from "openbz/plugin-sdk/acpx";
import { createAcpxPluginConfigSchema } from "./src/config.js";
import { createAcpxRuntimeService } from "./src/service.js";

const plugin = {
  id: "acpx",
  name: "ACPX Runtime",
  description: "ACP runtime backend powered by the acpx CLI.",
  configSchema: createAcpxPluginConfigSchema(),
  register(api: OpenBZPluginApi) {
    api.registerService(
      createAcpxRuntimeService({
        pluginConfig: api.pluginConfig,
      }),
    );
  },
};

export default plugin;

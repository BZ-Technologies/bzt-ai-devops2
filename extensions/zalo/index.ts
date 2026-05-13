import type { OpenBZPluginApi } from "openbz/plugin-sdk/zalo";
import { emptyPluginConfigSchema } from "openbz/plugin-sdk/zalo";
import { zaloPlugin } from "./src/channel.js";
import { setZaloRuntime } from "./src/runtime.js";

const plugin = {
  id: "zalo",
  name: "Zalo",
  description: "Zalo channel plugin (Bot API)",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenBZPluginApi) {
    setZaloRuntime(api.runtime);
    api.registerChannel(zaloPlugin);
  },
};

export default plugin;

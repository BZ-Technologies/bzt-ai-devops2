import type { OpenBZPluginApi } from "openbz/plugin-sdk/synology-chat";
import { emptyPluginConfigSchema } from "openbz/plugin-sdk/synology-chat";
import { synologyChatPlugin } from "./src/channel.js";
import { setSynologyRuntime } from "./src/runtime.js";

const plugin = {
  id: "synology-chat",
  name: "Synology Chat",
  description: "Native Synology Chat channel plugin for BZ AI DevOps2",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenBZPluginApi) {
    setSynologyRuntime(api.runtime);
    api.registerChannel({ plugin: synologyChatPlugin });
  },
};

export default plugin;

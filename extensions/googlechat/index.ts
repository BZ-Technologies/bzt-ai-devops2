import type { OpenBZPluginApi } from "openbz/plugin-sdk/googlechat";
import { emptyPluginConfigSchema } from "openbz/plugin-sdk/googlechat";
import { googlechatPlugin } from "./src/channel.js";
import { setGoogleChatRuntime } from "./src/runtime.js";

const plugin = {
  id: "googlechat",
  name: "Google Chat",
  description: "BZ AI DevOps2 Google Chat channel plugin",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenBZPluginApi) {
    setGoogleChatRuntime(api.runtime);
    api.registerChannel(googlechatPlugin);
  },
};

export default plugin;

import type { OpenBZPluginApi } from "openbz/plugin-sdk/line";
import { emptyPluginConfigSchema } from "openbz/plugin-sdk/line";
import { registerLineCardCommand } from "./src/card-command.js";
import { linePlugin } from "./src/channel.js";
import { setLineRuntime } from "./src/runtime.js";

const plugin = {
  id: "line",
  name: "LINE",
  description: "LINE Messaging API channel plugin",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenBZPluginApi) {
    setLineRuntime(api.runtime);
    api.registerChannel({ plugin: linePlugin });
    if (api.registrationMode !== "full") {
      return;
    }
    registerLineCardCommand(api);
  },
};

export default plugin;

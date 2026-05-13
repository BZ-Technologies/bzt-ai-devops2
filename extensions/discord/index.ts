import type { OpenBZPluginApi } from "openbz/plugin-sdk/core";
import { emptyPluginConfigSchema } from "openbz/plugin-sdk/core";
import { discordPlugin } from "./src/channel.js";
import { setDiscordRuntime } from "./src/runtime.js";
import { registerDiscordSubagentHooks } from "./src/subagent-hooks.js";

const plugin = {
  id: "discord",
  name: "Discord",
  description: "Discord channel plugin",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenBZPluginApi) {
    setDiscordRuntime(api.runtime);
    api.registerChannel({ plugin: discordPlugin });
    if (api.registrationMode !== "full") {
      return;
    }
    registerDiscordSubagentHooks(api);
  },
};

export default plugin;

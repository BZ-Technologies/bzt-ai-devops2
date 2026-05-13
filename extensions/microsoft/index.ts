import { emptyPluginConfigSchema, type OpenBZPluginApi } from "openbz/plugin-sdk/core";
import { buildMicrosoftSpeechProvider } from "openbz/plugin-sdk/speech";

const microsoftPlugin = {
  id: "microsoft",
  name: "Microsoft Speech",
  description: "Bundled Microsoft speech provider",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenBZPluginApi) {
    api.registerSpeechProvider(buildMicrosoftSpeechProvider());
  },
};

export default microsoftPlugin;

import { emptyPluginConfigSchema, type OpenBZPluginApi } from "openbz/plugin-sdk/core";
import { buildElevenLabsSpeechProvider } from "openbz/plugin-sdk/speech";

const elevenLabsPlugin = {
  id: "elevenlabs",
  name: "ElevenLabs Speech",
  description: "Bundled ElevenLabs speech provider",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenBZPluginApi) {
    api.registerSpeechProvider(buildElevenLabsSpeechProvider());
  },
};

export default elevenLabsPlugin;

import type { PluginRuntime } from "openbz/plugin-sdk/core";
import { createPluginRuntimeStore } from "openbz/plugin-sdk/runtime-store";

const { setRuntime: setDiscordRuntime, getRuntime: getDiscordRuntime } =
  createPluginRuntimeStore<PluginRuntime>("Discord runtime not initialized");
export { getDiscordRuntime, setDiscordRuntime };

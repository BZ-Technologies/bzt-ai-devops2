import { createPluginRuntimeStore } from "openbz/plugin-sdk/runtime-store";
import type { PluginRuntime } from "openbz/plugin-sdk/twitch";

const { setRuntime: setTwitchRuntime, getRuntime: getTwitchRuntime } =
  createPluginRuntimeStore<PluginRuntime>("Twitch runtime not initialized");
export { getTwitchRuntime, setTwitchRuntime };

import type { PluginRuntime } from "openbz/plugin-sdk/irc";
import { createPluginRuntimeStore } from "openbz/plugin-sdk/runtime-store";

const { setRuntime: setIrcRuntime, getRuntime: getIrcRuntime } =
  createPluginRuntimeStore<PluginRuntime>("IRC runtime not initialized");
export { getIrcRuntime, setIrcRuntime };

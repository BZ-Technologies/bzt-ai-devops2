import type { PluginRuntime } from "openbz/plugin-sdk/core";
import { createPluginRuntimeStore } from "openbz/plugin-sdk/runtime-store";

const { setRuntime: setIMessageRuntime, getRuntime: getIMessageRuntime } =
  createPluginRuntimeStore<PluginRuntime>("iMessage runtime not initialized");
export { getIMessageRuntime, setIMessageRuntime };

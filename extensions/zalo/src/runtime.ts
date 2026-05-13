import { createPluginRuntimeStore } from "openbz/plugin-sdk/runtime-store";
import type { PluginRuntime } from "openbz/plugin-sdk/zalo";

const { setRuntime: setZaloRuntime, getRuntime: getZaloRuntime } =
  createPluginRuntimeStore<PluginRuntime>("Zalo runtime not initialized");
export { getZaloRuntime, setZaloRuntime };

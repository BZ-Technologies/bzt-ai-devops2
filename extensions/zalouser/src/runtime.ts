import { createPluginRuntimeStore } from "openbz/plugin-sdk/runtime-store";
import type { PluginRuntime } from "openbz/plugin-sdk/zalouser";

const { setRuntime: setZalouserRuntime, getRuntime: getZalouserRuntime } =
  createPluginRuntimeStore<PluginRuntime>("Zalouser runtime not initialized");
export { getZalouserRuntime, setZalouserRuntime };

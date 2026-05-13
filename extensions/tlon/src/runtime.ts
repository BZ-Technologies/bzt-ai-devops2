import { createPluginRuntimeStore } from "openbz/plugin-sdk/runtime-store";
import type { PluginRuntime } from "openbz/plugin-sdk/tlon";

const { setRuntime: setTlonRuntime, getRuntime: getTlonRuntime } =
  createPluginRuntimeStore<PluginRuntime>("Tlon runtime not initialized");
export { getTlonRuntime, setTlonRuntime };

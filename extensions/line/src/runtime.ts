import type { PluginRuntime } from "openbz/plugin-sdk/line";
import { createPluginRuntimeStore } from "openbz/plugin-sdk/runtime-store";

const { setRuntime: setLineRuntime, getRuntime: getLineRuntime } =
  createPluginRuntimeStore<PluginRuntime>("LINE runtime not initialized - plugin not registered");
export { getLineRuntime, setLineRuntime };

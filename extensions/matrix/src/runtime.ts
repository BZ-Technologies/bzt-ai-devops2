import type { PluginRuntime } from "openbz/plugin-sdk/matrix";
import { createPluginRuntimeStore } from "openbz/plugin-sdk/runtime-store";

const { setRuntime: setMatrixRuntime, getRuntime: getMatrixRuntime } =
  createPluginRuntimeStore<PluginRuntime>("Matrix runtime not initialized");
export { getMatrixRuntime, setMatrixRuntime };

import type { PluginRuntime } from "openbz/plugin-sdk/core";
import { createPluginRuntimeStore } from "openbz/plugin-sdk/runtime-store";

const { setRuntime: setSlackRuntime, getRuntime: getSlackRuntime } =
  createPluginRuntimeStore<PluginRuntime>("Slack runtime not initialized");
export { getSlackRuntime, setSlackRuntime };

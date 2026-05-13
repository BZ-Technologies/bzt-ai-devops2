import { createPluginRuntimeStore } from "openbz/plugin-sdk/runtime-store";
import type { PluginRuntime } from "openbz/plugin-sdk/synology-chat";

const { setRuntime: setSynologyRuntime, getRuntime: getSynologyRuntime } =
  createPluginRuntimeStore<PluginRuntime>(
    "Synology Chat runtime not initialized - plugin not registered",
  );
export { getSynologyRuntime, setSynologyRuntime };

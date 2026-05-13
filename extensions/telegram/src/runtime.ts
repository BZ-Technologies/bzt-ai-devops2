import type { PluginRuntime } from "openbz/plugin-sdk/core";
import { createPluginRuntimeStore } from "openbz/plugin-sdk/runtime-store";

const { setRuntime: setTelegramRuntime, getRuntime: getTelegramRuntime } =
  createPluginRuntimeStore<PluginRuntime>("Telegram runtime not initialized");
export { getTelegramRuntime, setTelegramRuntime };

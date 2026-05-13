import type { PluginRuntime } from "openbz/plugin-sdk/mattermost";
import { createPluginRuntimeStore } from "openbz/plugin-sdk/runtime-store";

const { setRuntime: setMattermostRuntime, getRuntime: getMattermostRuntime } =
  createPluginRuntimeStore<PluginRuntime>("Mattermost runtime not initialized");
export { getMattermostRuntime, setMattermostRuntime };

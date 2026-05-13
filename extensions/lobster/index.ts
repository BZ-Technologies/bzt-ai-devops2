import type {
  AnyAgentTool,
  OpenBZPluginApi,
  OpenBZPluginToolFactory,
} from "openbz/plugin-sdk/lobster";
import { createLobsterTool } from "./src/lobster-tool.js";

export default function register(api: OpenBZPluginApi) {
  api.registerTool(
    ((ctx) => {
      if (ctx.sandboxed) {
        return null;
      }
      return createLobsterTool(api) as AnyAgentTool;
    }) as OpenBZPluginToolFactory,
    { optional: true },
  );
}

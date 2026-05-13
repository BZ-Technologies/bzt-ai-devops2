import type { OpenBZPluginApi } from "openbz/plugin-sdk/plugin-runtime";

type TestPluginApiInput = Partial<OpenBZPluginApi> &
  Pick<OpenBZPluginApi, "id" | "name" | "source" | "config" | "runtime">;

export function createTestPluginApi(api: TestPluginApiInput): OpenBZPluginApi {
  return {
    registrationMode: "full",
    logger: { info() {}, warn() {}, error() {}, debug() {} },
    registerTool() {},
    registerHook() {},
    registerHttpRoute() {},
    registerChannel() {},
    registerGatewayMethod() {},
    registerCli() {},
    registerService() {},
    registerProvider() {},
    registerSpeechProvider() {},
    registerMediaUnderstandingProvider() {},
    registerImageGenerationProvider() {},
    registerWebSearchProvider() {},
    registerInteractiveHandler() {},
    registerCommand() {},
    registerContextEngine() {},
    resolvePath(input: string) {
      return input;
    },
    on() {},
    ...api,
  };
}

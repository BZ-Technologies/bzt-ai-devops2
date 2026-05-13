import type { OpenBZConfig } from "../config/config.js";
import type { RuntimeEnv } from "../runtime.js";
import { requireValidConfigSnapshot } from "./config-validation.js";

export function createQuietRuntime(runtime: RuntimeEnv): RuntimeEnv {
  return { ...runtime, log: () => {} };
}

export async function requireValidConfig(runtime: RuntimeEnv): Promise<OpenBZConfig | null> {
  return await requireValidConfigSnapshot(runtime);
}

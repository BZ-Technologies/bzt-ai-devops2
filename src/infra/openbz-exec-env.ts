export const OPENBZ_CLI_ENV_VAR = "OPENBZ_CLI";
export const OPENBZ_CLI_ENV_VALUE = "1";

export function markOpenBZExecEnv<T extends Record<string, string | undefined>>(env: T): T {
  return {
    ...env,
    [OPENBZ_CLI_ENV_VAR]: OPENBZ_CLI_ENV_VALUE,
  };
}

export function ensureOpenBZExecMarkerOnProcess(
  env: NodeJS.ProcessEnv = process.env,
): NodeJS.ProcessEnv {
  env[OPENBZ_CLI_ENV_VAR] = OPENBZ_CLI_ENV_VALUE;
  return env;
}

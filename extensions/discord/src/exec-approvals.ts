import type { OpenBZConfig } from "openbz/plugin-sdk/config-runtime";
import { getExecApprovalReplyMetadata } from "openbz/plugin-sdk/infra-runtime";
import type { ReplyPayload } from "openbz/plugin-sdk/reply-runtime";
import { resolveDiscordAccount } from "./accounts.js";

export function isDiscordExecApprovalClientEnabled(params: {
  cfg: OpenBZConfig;
  accountId?: string | null;
}): boolean {
  const config = resolveDiscordAccount(params).config.execApprovals;
  return Boolean(config?.enabled && (config.approvers?.length ?? 0) > 0);
}

export function shouldSuppressLocalDiscordExecApprovalPrompt(params: {
  cfg: OpenBZConfig;
  accountId?: string | null;
  payload: ReplyPayload;
}): boolean {
  return (
    isDiscordExecApprovalClientEnabled(params) &&
    getExecApprovalReplyMetadata(params.payload) !== null
  );
}

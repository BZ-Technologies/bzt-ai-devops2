import type { Command } from "commander";
import { formatDocsLink } from "../terminal/links.js";
import { theme } from "../terminal/theme.js";
import { registerQrCli } from "./qr-cli.js";

export function registerBzbotCli(program: Command) {
  const bzbot = program
    .command("bzbot")
    .description("Legacy bzbot command aliases")
    .addHelpText(
      "after",
      () =>
        `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/bzbot", "docs.openbz.ai/cli/bzbot")}\n`,
    );
  registerQrCli(bzbot);
}

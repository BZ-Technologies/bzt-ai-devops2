---
summary: "CLI reference for `openbz config` (get/set/unset/file/validate)"
read_when:
  - You want to read or edit config non-interactively
title: "config"
---

# `openbz config`

Config helpers: get/set/unset/validate values by path and print the active
config file. Run without a subcommand to open
the configure wizard (same as `openbz configure`).

## Examples

```bash
openbz config file
openbz config get browser.executablePath
openbz config set browser.executablePath "/usr/bin/google-chrome"
openbz config set agents.defaults.heartbeat.every "2h"
openbz config set agents.list[0].tools.exec.node "node-id-or-name"
openbz config unset tools.web.search.apiKey
openbz config validate
openbz config validate --json
```

## Paths

Paths use dot or bracket notation:

```bash
openbz config get agents.defaults.workspace
openbz config get agents.list[0].id
```

Use the agent list index to target a specific agent:

```bash
openbz config get agents.list
openbz config set agents.list[1].tools.exec.node "node-id-or-name"
```

## Values

Values are parsed as JSON5 when possible; otherwise they are treated as strings.
Use `--strict-json` to require JSON5 parsing. `--json` remains supported as a legacy alias.

```bash
openbz config set agents.defaults.heartbeat.every "0m"
openbz config set gateway.port 19001 --strict-json
openbz config set channels.whatsapp.groups '["*"]' --strict-json
```

## Subcommands

- `config file`: Print the active config file path (resolved from `OPENBZ_CONFIG_PATH` or default location).

Restart the gateway after edits.

## Validate

Validate the current config against the active schema without starting the
gateway.

```bash
openbz config validate
openbz config validate --json
```

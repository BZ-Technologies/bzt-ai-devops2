---
summary: "Advanced setup and development workflows for BZ AI DevOps2"
read_when:
  - Setting up a new machine
  - You want “latest + greatest” without breaking your personal setup
title: "Setup"
---

# Setup

<Note>
If you are setting up for the first time, start with [Getting Started](/start/getting-started).
For onboarding details, see [Onboarding (CLI)](/start/wizard).
</Note>

Last updated: 2026-01-01

## TL;DR

- **Tailoring lives outside the repo:** `~/.openbz/workspace` (workspace) + `~/.openbz/openbz.json` (config).
- **Stable workflow:** install the macOS app; let it run the bundled Gateway.
- **Bleeding edge workflow:** run the Gateway yourself via `pnpm gateway:watch`, then let the macOS app attach in Local mode.

## Prereqs (from source)

- Node `>=22`
- `pnpm`
- Docker (optional; only for containerized setup/e2e — see [Docker](/install/docker))

## Tailoring strategy (so updates don’t hurt)

If you want “100% tailored to me” _and_ easy updates, keep your customization in:

- **Config:** `~/.openbz/openbz.json` (JSON/JSON5-ish)
- **Workspace:** `~/.openbz/workspace` (skills, prompts, memories; make it a private git repo)

Bootstrap once:

```bash
openbz setup
```

From inside this repo, use the local CLI entry:

```bash
openbz setup
```

If you don’t have a global install yet, run it via `pnpm openbz setup`.

## Run the Gateway from this repo

After `pnpm build`, you can run the packaged CLI directly:

```bash
node openbz.mjs gateway --port 18789 --verbose
```

## Stable workflow (macOS app first)

1. Install + launch **BZ AI DevOps2.app** (menu bar).
2. Complete the onboarding/permissions checklist (TCC prompts).
3. Ensure Gateway is **Local** and running (the app manages it).
4. Link surfaces (example: WhatsApp):

```bash
openbz channels login
```

5. Sanity check:

```bash
openbz health
```

If onboarding is not available in your build:

- Run `openbz setup`, then `openbz channels login`, then start the Gateway manually (`openbz gateway`).

## Bleeding edge workflow (Gateway in a terminal)

Goal: work on the TypeScript Gateway, get hot reload, keep the macOS app UI attached.

### 0) (Optional) Run the macOS app from source too

If you also want the macOS app on the bleeding edge:

```bash
./scripts/restart-mac.sh
```

### 1) Start the dev Gateway

```bash
pnpm install
pnpm gateway:watch
```

`gateway:watch` runs the gateway in watch mode and reloads on relevant source,
config, and bundled-plugin metadata changes.

### 2) Point the macOS app at your running Gateway

In **BZ AI DevOps2.app**:

- Connection Mode: **Local**
  The app will attach to the running gateway on the configured port.

### 3) Verify

- In-app Gateway status should read **“Using existing gateway …”**
- Or via CLI:

```bash
openbz health
```

### Common footguns

- **Wrong port:** Gateway WS defaults to `ws://127.0.0.1:18789`; keep app + CLI on the same port.
- **Where state lives:**
  - Credentials: `~/.openbz/credentials/`
  - Sessions: `~/.openbz/agents/<agentId>/sessions/`
  - Logs: `/tmp/openbz/`

## Credential storage map

Use this when debugging auth or deciding what to back up:

- **WhatsApp**: `~/.openbz/credentials/whatsapp/<accountId>/creds.json`
- **Telegram bot token**: config/env or `channels.telegram.tokenFile` (regular file only; symlinks rejected)
- **Discord bot token**: config/env or SecretRef (env/file/exec providers)
- **Slack tokens**: config/env (`channels.slack.*`)
- **Pairing allowlists**:
  - `~/.openbz/credentials/<channel>-allowFrom.json` (default account)
  - `~/.openbz/credentials/<channel>-<accountId>-allowFrom.json` (non-default accounts)
- **Model auth profiles**: `~/.openbz/agents/<agentId>/agent/auth-profiles.json`
- **File-backed secrets payload (optional)**: `~/.openbz/secrets.json`
- **Legacy OAuth import**: `~/.openbz/credentials/oauth.json`
  More detail: [Security](/gateway/security#credential-storage-map).

## Updating (without wrecking your setup)

- Keep `~/.openbz/workspace` and `~/.openbz/` as “your stuff”; don’t put personal prompts/config into the `openbz` repo.
- Updating source: `git pull` + `pnpm install` (when lockfile changed) + keep using `pnpm gateway:watch`.

## Linux (systemd user service)

Linux installs use a systemd **user** service. By default, systemd stops user
services on logout/idle, which kills the Gateway. Onboarding attempts to enable
lingering for you (may prompt for sudo). If it’s still off, run:

```bash
sudo loginctl enable-linger $USER
```

For always-on or multi-user servers, consider a **system** service instead of a
user service (no lingering needed). See [Gateway runbook](/gateway) for the systemd notes.

## Related docs

- [Gateway runbook](/gateway) (flags, supervision, ports)
- [Gateway configuration](/gateway/configuration) (config schema + examples)
- [Discord](/channels/discord) and [Telegram](/channels/telegram) (reply tags + replyToMode settings)
- [BZ AI DevOps2 assistant setup](/start/openbz)
- [macOS app](/platforms/macos) (gateway lifecycle)

# BZDock <!-- omit in toc -->

Stop typing `docker-compose` commands. Just type `bzdock-start`.

Inspired by Simon Willison's [Running BZ AI DevOps2 in Docker](https://til.simonwillison.net/llms/openbz-docker).

- [Quickstart](#quickstart)
- [Available Commands](#available-commands)
  - [Basic Operations](#basic-operations)
  - [Container Access](#container-access)
  - [Web UI \& Devices](#web-ui--devices)
  - [Setup \& Configuration](#setup--configuration)
  - [Maintenance](#maintenance)
  - [Utilities](#utilities)
- [Common Workflows](#common-workflows)
  - [Check Status and Logs](#check-status-and-logs)
  - [Set Up WhatsApp Bot](#set-up-whatsapp-bot)
  - [Troubleshooting Device Pairing](#troubleshooting-device-pairing)
  - [Fix Token Mismatch Issues](#fix-token-mismatch-issues)
  - [Permission Denied](#permission-denied)
- [Requirements](#requirements)

## Quickstart

**Install:**

```bash
mkdir -p ~/.bzdock && curl -sL https://raw.githubusercontent.com/openbz/openbz/main/scripts/shell-helpers/bzdock-helpers.sh -o ~/.bzdock/bzdock-helpers.sh
```

```bash
echo 'source ~/.bzdock/bzdock-helpers.sh' >> ~/.zshrc && source ~/.zshrc
```

**See what you get:**

```bash
bzdock-help
```

On first command, ClawDock auto-detects your BZ AI DevOps2 directory:

- Checks common paths (`~/openbz`, `~/workspace/openbz`, etc.)
- If found, asks you to confirm
- Saves to `~/.bzdock/config`

**First time setup:**

```bash
bzdock-start
```

```bash
bzdock-fix-token
```

```bash
bzdock-dashboard
```

If you see "pairing required":

```bash
bzdock-devices
```

And approve the request for the specific device:

```bash
bzdock-approve <request-id>
```

## Available Commands

### Basic Operations

| Command            | Description                     |
| ------------------ | ------------------------------- |
| `bzdock-start`   | Start the gateway               |
| `bzdock-stop`    | Stop the gateway                |
| `bzdock-restart` | Restart the gateway             |
| `bzdock-status`  | Check container status          |
| `bzdock-logs`    | View live logs (follows output) |

### Container Access

| Command                   | Description                                    |
| ------------------------- | ---------------------------------------------- |
| `bzdock-shell`          | Interactive shell inside the gateway container |
| `bzdock-cli <command>`  | Run BZ AI DevOps2 CLI commands                      |
| `bzdock-exec <command>` | Execute arbitrary commands in the container    |

### Web UI & Devices

| Command                 | Description                                |
| ----------------------- | ------------------------------------------ |
| `bzdock-dashboard`    | Open web UI in browser with authentication |
| `bzdock-devices`      | List device pairing requests               |
| `bzdock-approve <id>` | Approve a device pairing request           |

### Setup & Configuration

| Command              | Description                                       |
| -------------------- | ------------------------------------------------- |
| `bzdock-fix-token` | Configure gateway authentication token (run once) |

### Maintenance

| Command            | Description                                      |
| ------------------ | ------------------------------------------------ |
| `bzdock-rebuild` | Rebuild the Docker image                         |
| `bzdock-clean`   | Remove all containers and volumes (destructive!) |

### Utilities

| Command              | Description                               |
| -------------------- | ----------------------------------------- |
| `bzdock-health`    | Run gateway health check                  |
| `bzdock-token`     | Display the gateway authentication token  |
| `bzdock-cd`        | Jump to the BZ AI DevOps2 project directory    |
| `bzdock-config`    | Open the BZ AI DevOps2 config directory        |
| `bzdock-workspace` | Open the workspace directory              |
| `bzdock-help`      | Show all available commands with examples |

## Common Workflows

### Check Status and Logs

**Restart the gateway:**

```bash
bzdock-restart
```

**Check container status:**

```bash
bzdock-status
```

**View live logs:**

```bash
bzdock-logs
```

### Set Up WhatsApp Bot

**Shell into the container:**

```bash
bzdock-shell
```

**Inside the container, login to WhatsApp:**

```bash
openbz channels login --channel whatsapp --verbose
```

Scan the QR code with WhatsApp on your phone.

**Verify connection:**

```bash
openbz status
```

### Troubleshooting Device Pairing

**Check for pending pairing requests:**

```bash
bzdock-devices
```

**Copy the Request ID from the "Pending" table, then approve:**

```bash
bzdock-approve <request-id>
```

Then refresh your browser.

### Fix Token Mismatch Issues

If you see "gateway token mismatch" errors:

```bash
bzdock-fix-token
```

This will:

1. Read the token from your `.env` file
2. Configure it in the BZ AI DevOps2 config
3. Restart the gateway
4. Verify the configuration

### Permission Denied

**Ensure Docker is running and you have permission:**

```bash
docker ps
```

## Requirements

- Docker and Docker Compose installed
- Bash or Zsh shell
- BZ AI DevOps2 project (from `docker-setup.sh`)

## Development

**Test with fresh config (mimics first-time install):**

```bash
unset BZDOCK_DIR && rm -f ~/.bzdock/config && source scripts/shell-helpers/bzdock-helpers.sh
```

Then run any command to trigger auto-detect:

```bash
bzdock-start
```

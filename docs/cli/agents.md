---
summary: "CLI reference for `openbz agents` (list/add/delete/bindings/bind/unbind/set identity)"
read_when:
  - You want multiple isolated agents (workspaces + routing + auth)
title: "agents"
---

# `openbz agents`

Manage isolated agents (workspaces + auth + routing).

Related:

- Multi-agent routing: [Multi-Agent Routing](/concepts/multi-agent)
- Agent workspace: [Agent workspace](/concepts/agent-workspace)

## Examples

```bash
openbz agents list
openbz agents add work --workspace ~/.openbz/workspace-work
openbz agents bindings
openbz agents bind --agent work --bind telegram:ops
openbz agents unbind --agent work --bind telegram:ops
openbz agents set-identity --workspace ~/.openbz/workspace --from-identity
openbz agents set-identity --agent main --avatar avatars/openbz.png
openbz agents delete work
```

## Routing bindings

Use routing bindings to pin inbound channel traffic to a specific agent.

List bindings:

```bash
openbz agents bindings
openbz agents bindings --agent work
openbz agents bindings --json
```

Add bindings:

```bash
openbz agents bind --agent work --bind telegram:ops --bind discord:guild-a
```

If you omit `accountId` (`--bind <channel>`), BZ AI DevOps2 resolves it from channel defaults and plugin setup hooks when available.

### Binding scope behavior

- A binding without `accountId` matches the channel default account only.
- `accountId: "*"` is the channel-wide fallback (all accounts) and is less specific than an explicit account binding.
- If the same agent already has a matching channel binding without `accountId`, and you later bind with an explicit or resolved `accountId`, BZ AI DevOps2 upgrades that existing binding in place instead of adding a duplicate.

Example:

```bash
# initial channel-only binding
openbz agents bind --agent work --bind telegram

# later upgrade to account-scoped binding
openbz agents bind --agent work --bind telegram:ops
```

After the upgrade, routing for that binding is scoped to `telegram:ops`. If you also want default-account routing, add it explicitly (for example `--bind telegram:default`).

Remove bindings:

```bash
openbz agents unbind --agent work --bind telegram:ops
openbz agents unbind --agent work --all
```

## Identity files

Each agent workspace can include an `IDENTITY.md` at the workspace root:

- Example path: `~/.openbz/workspace/IDENTITY.md`
- `set-identity --from-identity` reads from the workspace root (or an explicit `--identity-file`)

Avatar paths resolve relative to the workspace root.

## Set identity

`set-identity` writes fields into `agents.list[].identity`:

- `name`
- `theme`
- `emoji`
- `avatar` (workspace-relative path, http(s) URL, or data URI)

Load from `IDENTITY.md`:

```bash
openbz agents set-identity --workspace ~/.openbz/workspace --from-identity
```

Override fields explicitly:

```bash
openbz agents set-identity --agent main --name "BZ AI DevOps2" --emoji "🦞" --avatar avatars/openbz.png
```

Config sample:

```json5
{
  agents: {
    list: [
      {
        id: "main",
        identity: {
          name: "BZ AI DevOps2",
          theme: "space lobster",
          emoji: "🦞",
          avatar: "avatars/openbz.png",
        },
      },
    ],
  },
}
```

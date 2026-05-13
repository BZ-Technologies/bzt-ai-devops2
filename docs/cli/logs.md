---
summary: "CLI reference for `openbz logs` (tail gateway logs via RPC)"
read_when:
  - You need to tail Gateway logs remotely (without SSH)
  - You want JSON log lines for tooling
title: "logs"
---

# `openbz logs`

Tail Gateway file logs over RPC (works in remote mode).

Related:

- Logging overview: [Logging](/logging)

## Examples

```bash
openbz logs
openbz logs --follow
openbz logs --json
openbz logs --limit 500
openbz logs --local-time
openbz logs --follow --local-time
```

Use `--local-time` to render timestamps in your local timezone.

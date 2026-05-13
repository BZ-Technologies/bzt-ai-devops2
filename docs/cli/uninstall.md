---
summary: "CLI reference for `openbz uninstall` (remove gateway service + local data)"
read_when:
  - You want to remove the gateway service and/or local state
  - You want a dry-run first
title: "uninstall"
---

# `openbz uninstall`

Uninstall the gateway service + local data (CLI remains).

```bash
openbz backup create
openbz uninstall
openbz uninstall --all --yes
openbz uninstall --dry-run
```

Run `openbz backup create` first if you want a restorable snapshot before removing state or workspaces.

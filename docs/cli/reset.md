---
summary: "CLI reference for `openbz reset` (reset local state/config)"
read_when:
  - You want to wipe local state while keeping the CLI installed
  - You want a dry-run of what would be removed
title: "reset"
---

# `openbz reset`

Reset local config/state (keeps the CLI installed).

```bash
openbz backup create
openbz reset
openbz reset --dry-run
openbz reset --scope config+creds+sessions --yes --non-interactive
```

Run `openbz backup create` first if you want a restorable snapshot before removing local state.

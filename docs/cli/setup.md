---
summary: "CLI reference for `openbz setup` (initialize config + workspace)"
read_when:
  - You’re doing first-run setup without full CLI onboarding
  - You want to set the default workspace path
title: "setup"
---

# `openbz setup`

Initialize `~/.openbz/openbz.json` and the agent workspace.

Related:

- Getting started: [Getting started](/start/getting-started)
- CLI onboarding: [Onboarding (CLI)](/start/wizard)

## Examples

```bash
openbz setup
openbz setup --workspace ~/.openbz/workspace
```

To run onboarding via setup:

```bash
openbz setup --wizard
```

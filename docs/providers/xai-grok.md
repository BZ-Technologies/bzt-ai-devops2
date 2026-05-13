---
summary: "Use xAI Grok via API key in BZ AI DevOps2"
read_when:
  - You want Grok alongside Claude, OpenAI, and Gemini
  - You need xAI API key setup
title: "xAI (Grok)"
---

# xAI (Grok)

xAI provides **Grok** models via an OpenAI-compatible API (`https://api.x.ai/v1`).
BZ AI DevOps2 bundles the **xAI** provider plugin with API-key auth.

## Setup

Create an API key in the [xAI console](https://console.x.ai/).

### CLI

```bash
openbz onboard
# choose: xAI (Grok) → xAI API key

# or non-interactive
openbz onboard --auth-choice xai-api-key --xai-api-key "$XAI_API_KEY"
```

### Environment

```bash
export XAI_API_KEY=xai-...
```

### Config snippet

```json5
{
  env: { XAI_API_KEY: "xai-..." },
  agents: { defaults: { model: { primary: "xai/grok-4" } } },
}
```

## Models

Onboarding registers common catalog entries (IDs may evolve with xAI):

- `xai/grok-4` — default flagship-style Grok
- `xai/grok-3`
- `xai/grok-3-mini` — lower-cost

Additional xAI model IDs (e.g. `grok-4-fast-reasoning`) can be used if listed in your xAI account; configure via `agents.defaults.models` / Control UI models when needed.

## Web search (Grok)

The plugin also registers **Grok** as a web-search backend when `XAI_API_KEY` is set. See [Web tools](/tools/web).

## See also

- [BZ core four providers](/providers/bz-core-models) — Claude, OpenAI, Gemini, Grok together
- [Model providers index](/providers)

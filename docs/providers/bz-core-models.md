---
summary: "Run Claude, OpenAI, Gemini, and Grok together with env keys and model failover"
read_when:
  - You want BZ multi-LLM stack in one gateway
  - You configure Proxmox or Vault-fed secrets
title: "BZ core models (Claude, OpenAI, Gemini, Grok)"
---

**Generated**: 2026-03-18 12:40:00 CDT  
**Last Updated**: 2026-03-18 12:40:00 CDT  
**Version**: 1.0

# BZ core models: Claude, OpenAI, Gemini, Grok

Use this layout when you want **four first-class providers** in one BZ AI DevOps2 deployment: **Anthropic (Claude)**, **OpenAI**, **Google (Gemini)**, and **xAI (Grok)**.

## 1. Environment variables

Set keys from Vault/1Password in production; never commit real values.

| Provider   | Env variable(s)              | Notes                          |
| ---------- | ---------------------------- | ------------------------------ |
| Claude     | `ANTHROPIC_API_KEY`          | Or OAuth / setup-token         |
| OpenAI     | `OPENAI_API_KEY`             | Or Codex OAuth via onboard     |
| Gemini     | `GEMINI_API_KEY` or `GOOGLE_API_KEY` | Google AI Studio            |
| Grok       | `XAI_API_KEY`                | [xAI console](https://console.x.ai/) |

Example `.env` fragment:

```bash
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...
XAI_API_KEY=xai-...
```

See repository **`.env.example`** and **`deploy/.env.proxmox.example`**.

## 2. Onboard each provider

```bash
openbz onboard --anthropic-api-key "$ANTHROPIC_API_KEY"
openbz onboard --openai-api-key "$OPENAI_API_KEY"
openbz onboard --auth-choice gemini-api-key   # or flag for Gemini key
openbz onboard --auth-choice xai-api-key --xai-api-key "$XAI_API_KEY"
```

Interactive `openbz onboard` can walk through multiple providers in one session.

## 3. Primary + failover (recommended)

Pick a **primary** and ordered **fallbacks** so outages or rate limits roll to another provider.

Example: Claude primary, then OpenAI, Gemini, Grok:

```json5
{
  env: {
    ANTHROPIC_API_KEY: "sk-ant-...",
    OPENAI_API_KEY: "sk-...",
    GEMINI_API_KEY: "...",
    XAI_API_KEY: "xai-...",
  },
  agents: {
    defaults: {
      model: {
        primary: "anthropic/claude-sonnet-4-6",
        fallbacks: [
          "openai/gpt-5.1-codex",
          "google/gemini-3.1-pro-preview",
          "xai/grok-4",
        ],
      },
    },
  },
}
```

Adjust model IDs to match **`openbz models`** / Control UI for your installed plugins. Lighter fallbacks (e.g. `openai/gpt-5-mini`, `xai/grok-3-mini`) reduce cost.

## 4. Provider docs

- [Anthropic (Claude)](/providers/anthropic)
- [OpenAI](/providers/openai)
- [Google Gemini](/concepts/model-providers) (Gemini via Google plugin)
- [xAI (Grok)](/providers/xai-grok)

---

**Last Updated**: 2026-03-18 12:40:00 CDT

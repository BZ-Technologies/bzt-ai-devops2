# BZDevOps v2 PRD alignment — BZ AI DevOps2 repo

**Generated**: 2026-03-18 12:25:16 CDT  
**Last Updated**: 2026-03-18 12:25:16 CDT  
**Version**: 1.0  
**Status**: Living roadmap

**Source PRD**: `bzt-ai-devops/docs/PRD-BZDEVOPS-V2.md` (authoritative product direction).

This document maps **BZ AI DevOps2** (this codebase: multi-channel AI gateway, Control UI, MCP-friendly automation surface) to BZDevOps v2 themes and proposes **phased** work without replacing upstream capabilities overnight.

## 1. Strategic fit

| PRD theme                         | This repo today                         | Direction                                                   |
| --------------------------------- | --------------------------------------- | ----------------------------------------------------------- |
| Intent-first / natural language   | Chat + CLI + channel messages           | Formal **intent API** + structured outcome schema (INT-*)   |
| MCP as execution surface        | Plugins, skills, gateway                | Richer tool metadata; **outcome-to-action** doc (MCP-3)     |
| Portal chat UX (POR-5–POR-9)      | Control UI (chat, config)               | Left history, attachments, voice (phased); **tenant-scoped sharing** |
| Semantic layer / dictionary (SEM-*) | Limited                         | Config- or API-driven dictionary; inject into agent context |
| RAG (RAG-*)                       | Not core yet                            | Index runbooks, `config.yaml`, docs; redaction pipeline     |
| OPA / policy (OPA-*)            | Operator config, skills                 | Gate tool invocations + config writes                       |
| Triple-gate security (SEC-*)      | Pairing, tokens, skill boundaries       | Explicit gates: prompt filter, tool gateway, infra auth     |
| Proxmox-first                     | Generic host deployment                 | **Proxmox runbook** + compose; tie-in to BZ MCP inventory   |
| Observability (NFR-3)             | Varies by deployment                    | Tenant/request context on intent + MCP paths                |

## 2. Phase plan (suggested)

### Phase A — Productize shell (current sprint)

- BZ **branding** (navy/gold UI, favicon, docs): `docs/branding/BZ-BRAND.md`.
- **Proxmox hosting** runbook + compose example: `docs/deploy/PROXMOX-HOSTING.md`, `deploy/docker-compose.proxmox.example.yml`.
- README / VISION: enterprise positioning; link to this file and PRD.

### Phase B — Control plane hooks

- Document **outcome-to-action** mappings for existing scripts/MCP (even if executed manually first).
- Health + metrics endpoints consistent with `bzt-mon-01` scraping.
- Environment template for Vault-fed secrets on BZ VMs.

### Phase C — Intent and policy (PRD core)

- Intent submission **API** + status model (INT-1, INT-4).
- OPA (or equivalent) hook before destructive MCP/config operations (OPA-1, MCP-4).
- Optional RAG over `docs/`, `.cursor/rules`, and customer-provided paths (RAG-1, RAG-3).

### Phase D — Portal parity (POR-5+)

- Chat layout: persistent history, file attach, voice transcription path.
- Sharing model (CSC-*) aligned with Portal tenant identity (future).

## 3. Non-goals (near term)

- Replacing **bzt-ai-devops** Python control plane with this repo in one step.
- Full MSP billing multi-tenant product packaging (PRD non-goal for v2 first cut).

## 4. References

- Vision / IDP alignment: `bzt-ai-devops/docs/ALIGNMENT-BZDEVOPS-VISION-PRD-IDP.md`
- Reverse proxy: `bzt-ai-devops/docs/REVERSE-PROXY-STANDARD.md`
- Vault paths: `bzt-architecture` tenant organization docs

---

**Last Updated**: 2026-03-18 12:25:16 CDT

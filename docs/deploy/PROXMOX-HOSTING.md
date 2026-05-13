# Hosting BZ AI DevOps2 on Proxmox (BZ stack)

**Generated**: 2026-03-18 12:25:16 CDT  
**Last Updated**: 2026-03-18 12:25:16 CDT  
**Version**: 1.0  
**Status**: Draft runbook

## Overview

Deploy the gateway + Control UI on a Debian 12/13 VM or LXC on Proxmox, consistent with BZ infrastructure (FQDNs, Traefik, Vault-backed secrets). This complements the existing **`Dockerfile`** in repo root.

## Target VM (example)

| Item        | Example                                      |
| ----------- | -------------------------------------------- |
| Hostname    | `bzt-prd-ai-02.bztech.org` (or dedicated app VM) |
| VLAN        | Per `bzt-ai-devops` `config/config.yaml`     |
| OS          | Debian 12+                                   |
| Accounts    | `bzt-infra-automation` for automation      |

Use **fully qualified domain names** only (MikroTik DNS).

## Prerequisites

1. **Docker** (or Podman) on the guest.
2. **TLS**: Terminate at Traefik/Nginx on `bzt-web-01` or colocated reverse proxy; internal container may listen on HTTP.
3. **Secrets**: Model keys, gateway auth, and provider tokens from **HashiCorp Vault** (never commit). Align paths with `bzt-architecture` Vault tenant organization.
4. **Firewall**: Allow inbound from proxy to container ports; restrict gateway admin/API to trusted networks.

## Build and run (single container)

From repo root on a build host or CI:

```bash
docker build -t bzt-ai-devops2:local .
```

Runtime (illustrative — set env from Vault at deploy time):

```bash
docker run -d --name bzt-ai-devops2 \
  --restart unless-stopped \
  -p 18789:18789 \
  -e OPENAI_API_KEY="$(vault kv get -field=key ...)" \
  bzt-ai-devops2:local
```

Adjust published port and env to match your `openbz.json` / gateway config. See upstream docs for full configuration.

## Compose (multi-service)

See **`deploy/docker-compose.proxmox.example.yml`** for a template: optional sidecar for observability, volume for config/state, and labels for Traefik.

## Traefik / routing

- Route public hostname (e.g. `ai-devops2.bztech.org`) to the Control UI and gateway ports documented in your deployment.
- Follow **`bzt-ai-devops/docs/REVERSE-PROXY-STANDARD.md`** for TLS and headers.

## Observability

Per BZ standards: structured logs, tenant/request context where applicable, scrape `/health` if exposed. Connect to Prometheus on `bzt-mon-01.bztech.org` when the service is production-grade.

## Next steps (enterprise)

Map features to **`docs/BZDEVOPS-V2-PRD-ALIGNMENT.md`**: intent API, OPA, RAG, and portal chat UX.

---

**Last Updated**: 2026-03-18 12:25:16 CDT

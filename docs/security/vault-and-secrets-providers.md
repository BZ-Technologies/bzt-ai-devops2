---
title: Vault and secrets providers (MVP P0)
summary: HashiCorp Vault, AWS, Azure, GCP, 1Password, and exec hooks for enterprise secrets.
read_when:
  - Integrating OpenBZ with a cloud or enterprise vault
  - Configuring secrets.providers exec bridges
permalink: /security/vault-and-secrets-providers/
---

# Vault and secrets providers (MVP P0)

**Generated**: 2026-03-18 12:46:59 CDT  
**Last Updated**: 2026-03-18 12:46:59 CDT  
**Version**: 1.0  
**Status**: Active

OpenBZ resolves API keys and other secrets via **`secrets.providers`** in config: **environment**, **file** (JSON), or **exec** (arbitrary process). Cloud and enterprise vaults integrate through **exec providers**: small bridge programs that speak the OpenBZ exec protocol below.

## Exec protocol (stdin → stdout)

**Stdin** (JSON):

```json
{
  "protocolVersion": 1,
  "provider": "your-provider-name",
  "ids": ["ref-id-1", "ref-id-2"]
}
```

**Stdout** (JSON), success:

```json
{
  "protocolVersion": 1,
  "values": {
    "ref-id-1": "secret-value-a",
    "ref-id-2": "secret-value-b"
  }
}
```

Per-id failures can be reported with **`errors`**: `{ "ref-id": { "message": "..." } }` (OpenBZ will surface the message). The bridge command must exit **0** on full success; use non-zero exit if the batch cannot be satisfied.

Reference bridges live in **`scripts/secrets-providers/`** (Node.js, no extra npm deps). Point **`secrets.providers.<name>.command`** at the script; use **`passEnv`** so cloud CLIs see `AWS_*`, `AZURE_*`, `VAULT_TOKEN`, etc.

## HashiCorp Vault (KV v2)

| Item | Detail |
|------|--------|
| CLI | `vault` |
| Bridge | `hashicorp-vault-bridge.mjs` |
| Env | `VAULT_ADDR`, `VAULT_TOKEN` (or Vault agent / logged-in CLI) |
| Id format | `path/to/secret` or `path/to/secret#field` (KV path under mount; optional JSON key under `data.data`) |

**Config example**

```yaml
secrets:
  providers:
    vault:
      source: exec
      command: /opt/openbz/scripts/secrets-providers/hashicorp-vault-bridge.mjs
      passEnv:
        - VAULT_ADDR
        - VAULT_TOKEN
      env:
        OPENBZ_VAULT_MOUNT: secret
```

**Ref example** (e.g. OpenAI key): `source: exec`, `provider: vault`, `id: ` `bztech/llm/openai#apiKey`.

## AWS Secrets Manager

| Item | Detail |
|------|--------|
| CLI | `aws` (v2) |
| Bridge | `aws-secrets-manager-bridge.mjs` |
| Env | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` (or instance role / SSO session) |
| Id format | Secret name or ARN; optional `name#jsonKey` if `SecretString` is JSON |

## Azure Key Vault

| Item | Detail |
|------|--------|
| CLI | `az` |
| Bridge | `azure-keyvault-bridge.mjs` |
| Env | Azure CLI logged in (`az login`) or `AZURE_CLIENT_ID` / `AZURE_TENANT_ID` / `AZURE_CLIENT_SECRET` as supported by `az` |
| Id format | `vault-name/secret-name` |

## Google Cloud Secret Manager

| Item | Detail |
|------|--------|
| CLI | `gcloud` |
| Bridge | `gcp-secret-manager-bridge.mjs` |
| Env | `GOOGLE_APPLICATION_CREDENTIALS` or `gcloud auth application-default login` |
| Id format | Secret **id** (short name); set **`OPENBZ_GCP_PROJECT`** (or pass `project/secretId`) |

## 1Password (CLI)

| Item | Detail |
|------|--------|
| CLI | `op` |
| Bridge | `onepassword-bridge.mjs` |
| Env | `OP_SERVICE_ACCOUNT_TOKEN` or interactive `op signin` session |
| Id format | `op://vault/item/field` (same as `op read`) |

## Other systems (pattern)

| System | Typical hook |
|--------|----------------|
| **CyberArk Conjur** | Exec script: `conjur variable value path/to/secret` → map to `values[id]`. |
| **Doppler** | Exec: `doppler secrets get KEY --plain` per id, or one script batching keys. |
| **Kubernetes** | File provider: mounted `secret` volume JSON; or exec calling `kubectl`. |
| **Oracle OCI Vault** | Exec: `oci secrets secret-bundle get` + parse. |

Any vault with a **CLI or HTTP API** can be wrapped the same way: read **`ids`** from stdin, fetch each secret, print **`protocolVersion: 1`** and **`values`**.

## Security notes

- Prefer **least privilege** IAM / policies per secret path.
- Use **`trustedDirs`** / non-world-writable commands for exec providers (see main secrets docs).
- Do not log secret values; bridges should only emit JSON to stdout.

---

**Report Generated**: 2026-03-18 12:46:59 CDT  
**Last Updated**: 2026-03-18 12:46:59 CDT

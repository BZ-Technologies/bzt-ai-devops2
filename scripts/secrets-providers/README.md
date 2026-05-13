# OpenBZ secrets provider bridges

These scripts implement the OpenBZ **exec** secrets protocol (JSON on stdin → JSON on stdout). Use them as `secrets.providers.<name>.command` in OpenBZ config.

| Script | Backend |
|--------|---------|
| `hashicorp-vault-bridge.mjs` | HashiCorp Vault KV v2 |
| `aws-secrets-manager-bridge.mjs` | AWS Secrets Manager |
| `azure-keyvault-bridge.mjs` | Azure Key Vault |
| `gcp-secret-manager-bridge.mjs` | Google Secret Manager |
| `onepassword-bridge.mjs` | 1Password CLI (`op read`) |

See **`docs/security/vault-and-secrets-providers.md`** for id formats and env vars.

**Requirements**: Node.js 18+; respective cloud CLI on `PATH` where used.

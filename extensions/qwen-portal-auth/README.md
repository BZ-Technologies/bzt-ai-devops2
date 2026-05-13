# Qwen OAuth (BZ AI DevOps2 plugin)

OAuth provider plugin for **Qwen** (free-tier OAuth).

## Enable

Bundled plugins are disabled by default. Enable this one:

```bash
openbz plugins enable qwen-portal-auth
```

Restart the Gateway after enabling.

## Authenticate

```bash
openbz models auth login --provider qwen-portal --set-default
```

## Notes

- Qwen OAuth uses a device-code login flow.
- Tokens auto-refresh; re-run login if refresh fails or access is revoked.

---
name: bzhub
description: Use the ClawHub CLI to search, install, update, and publish agent skills from bzhub.com. Use when you need to fetch new skills on the fly, sync installed skills to latest or a specific version, or publish new/updated skill folders with the npm-installed bzhub CLI.
metadata:
  {
    "openbz":
      {
        "requires": { "bins": ["bzhub"] },
        "install":
          [
            {
              "id": "node",
              "kind": "node",
              "package": "bzhub",
              "bins": ["bzhub"],
              "label": "Install ClawHub CLI (npm)",
            },
          ],
      },
  }
---

# ClawHub CLI

Install

```bash
npm i -g bzhub
```

Auth (publish)

```bash
bzhub login
bzhub whoami
```

Search

```bash
bzhub search "postgres backups"
```

Install

```bash
bzhub install my-skill
bzhub install my-skill --version 1.2.3
```

Update (hash-based match + upgrade)

```bash
bzhub update my-skill
bzhub update my-skill --version 1.2.3
bzhub update --all
bzhub update my-skill --force
bzhub update --all --no-input --force
```

List

```bash
bzhub list
```

Publish

```bash
bzhub publish ./my-skill --slug my-skill --name "My Skill" --version 1.2.0 --changelog "Fixes + docs"
```

Notes

- Default registry: https://bzhub.com (override with CLAWHUB_REGISTRY or --registry)
- Default workdir: cwd (falls back to BZ AI DevOps2 workspace); install dir: ./skills (override with --workdir / --dir / CLAWHUB_WORKDIR)
- Update command hashes local files, resolves matching version, and upgrades to latest unless --version is set

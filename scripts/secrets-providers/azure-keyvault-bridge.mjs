#!/usr/bin/env node
/**
 * OpenBZ exec secret bridge: Azure Key Vault.
 * Id: "vault-name/secret-name" (one slash separates vault from secret).
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";

function azShow(vault, name) {
  const r = spawnSync(
    "az",
    ["keyvault", "secret", "show", "--vault-name", vault, "--name", name, "--query", "value", "-o", "tsv"],
    { encoding: "utf8", maxBuffer: 1024 * 1024 },
  );
  if (r.error) throw r.error;
  if (r.status !== 0) {
    throw new Error(r.stderr?.trim() || `az exited ${r.status}`);
  }
  return r.stdout.trim();
}

function main() {
  const raw = fs.readFileSync(0, "utf8");
  const req = JSON.parse(raw);
  if (req.protocolVersion !== 1 || !Array.isArray(req.ids)) {
    console.error("Invalid request");
    process.exit(1);
  }
  const values = {};
  const errors = {};

  for (const id of req.ids) {
    try {
      const slash = id.indexOf("/");
      if (slash < 1 || slash === id.length - 1) {
        throw new Error('id must be "vault-name/secret-name"');
      }
      const vault = id.slice(0, slash);
      const name = id.slice(slash + 1);
      values[id] = azShow(vault, name);
    } catch (e) {
      errors[id] = { message: e instanceof Error ? e.message : String(e) };
    }
  }

  const out = { protocolVersion: 1, values };
  if (Object.keys(errors).length) out.errors = errors;
  console.log(JSON.stringify(out));
  if (Object.keys(errors).length) process.exit(1);
}

main();

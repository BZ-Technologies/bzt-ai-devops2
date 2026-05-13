#!/usr/bin/env node
/**
 * OpenBZ exec secret bridge: HashiCorp Vault KV v2.
 * Id: "path/to/secret" or "path/to/secret#field" (field under data.data).
 * Env: OPENBZ_VAULT_MOUNT (default secret), VAULT_ADDR, VAULT_TOKEN, etc.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";

function runVaultJson(mount, path) {
  const r = spawnSync(
    "vault",
    ["kv", "get", "-mount", mount, "-format", "json", path],
    { encoding: "utf8", maxBuffer: 2 * 1024 * 1024 },
  );
  if (r.error) throw r.error;
  if (r.status !== 0) {
    throw new Error(r.stderr?.trim() || `vault exited ${r.status}`);
  }
  return JSON.parse(r.stdout);
}

function main() {
  const raw = fs.readFileSync(0, "utf8");
  const req = JSON.parse(raw);
  if (req.protocolVersion !== 1 || !Array.isArray(req.ids)) {
    console.error("Invalid request: need protocolVersion 1 and ids[]");
    process.exit(1);
  }
  const mount = process.env.OPENBZ_VAULT_MOUNT || "secret";
  const values = {};
  const errors = {};

  for (const id of req.ids) {
    try {
      const hash = id.indexOf("#");
      const path = hash >= 0 ? id.slice(0, hash) : id;
      const field = hash >= 0 ? id.slice(hash + 1) : null;
      if (!path) throw new Error("empty path");
      const doc = runVaultJson(mount, path);
      const data = doc?.data?.data;
      if (data == null || typeof data !== "object") {
        throw new Error("vault response missing data.data");
      }
      if (field) {
        if (!(field in data)) throw new Error(`missing field: ${field}`);
        const v = data[field];
        values[id] = typeof v === "string" ? v : JSON.stringify(v);
      } else {
        const keys = Object.keys(data);
        if (keys.length === 1) {
          const v = data[keys[0]];
          values[id] = typeof v === "string" ? v : JSON.stringify(v);
        } else {
          values[id] = JSON.stringify(data);
        }
      }
    } catch (e) {
      errors[id] = { message: e instanceof Error ? e.message : String(e) };
    }
  }

  const out = { protocolVersion: 1, values };
  if (Object.keys(errors).length) out.errors = errors;
  console.log(JSON.stringify(out));
  if (Object.keys(errors).length === req.ids.length) process.exit(1);
  if (Object.keys(errors).length) process.exit(1);
}

main();

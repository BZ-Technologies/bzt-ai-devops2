#!/usr/bin/env node
/**
 * OpenBZ exec secret bridge: 1Password CLI (op read).
 * Id: op://vault/item/field (or any string op accepts).
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";

function opRead(ref) {
  const r = spawnSync("op", ["read", ref], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024,
  });
  if (r.error) throw r.error;
  if (r.status !== 0) {
    throw new Error(r.stderr?.trim() || `op exited ${r.status}`);
  }
  return r.stdout.trimEnd();
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
      if (!id.startsWith("op://")) {
        throw new Error('id must start with op:// (use op://vault/item/field)');
      }
      values[id] = opRead(id);
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

#!/usr/bin/env node
/**
 * OpenBZ exec secret bridge: AWS Secrets Manager.
 * Id: secret name/ARN, or "name#jsonKey" when SecretString is JSON.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";

function awsGetSecret(secretId) {
  const r = spawnSync(
    "aws",
    ["secretsmanager", "get-secret-value", "--secret-id", secretId, "--output", "json"],
    { encoding: "utf8", maxBuffer: 2 * 1024 * 1024 },
  );
  if (r.error) throw r.error;
  if (r.status !== 0) {
    throw new Error(r.stderr?.trim() || `aws exited ${r.status}`);
  }
  return JSON.parse(r.stdout);
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
      const hash = id.indexOf("#");
      const secretId = hash >= 0 ? id.slice(0, hash) : id;
      const jsonKey = hash >= 0 ? id.slice(hash + 1) : null;
      const doc = awsGetSecret(secretId);
      let str = doc.SecretString;
      if (str == null && doc.SecretBinary) {
        str = Buffer.from(doc.SecretBinary, "base64").toString("utf8");
      }
      if (str == null) throw new Error("no SecretString/SecretBinary");
      if (jsonKey) {
        const obj = JSON.parse(str);
        if (typeof obj !== "object" || obj == null || !(jsonKey in obj)) {
          throw new Error(`missing json key: ${jsonKey}`);
        }
        const v = obj[jsonKey];
        values[id] = typeof v === "string" ? v : JSON.stringify(v);
      } else {
        values[id] = str;
      }
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

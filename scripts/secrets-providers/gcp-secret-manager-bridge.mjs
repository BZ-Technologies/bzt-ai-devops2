#!/usr/bin/env node
/**
 * OpenBZ exec secret bridge: Google Secret Manager.
 * Id: secret id (short name). Env: OPENBZ_GCP_PROJECT required unless id is "project/secretId".
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";

function gcloudAccess(project, secretId) {
  const args = ["secrets", "versions", "access", "latest", "--secret", secretId, "-q"];
  if (project) args.push("--project", project);
  const r = spawnSync("gcloud", args, {
    encoding: "utf8",
    maxBuffer: 1024 * 1024,
  });
  if (r.error) throw r.error;
  if (r.status !== 0) {
    throw new Error(r.stderr?.trim() || `gcloud exited ${r.status}`);
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
  const defaultProject = process.env.OPENBZ_GCP_PROJECT || "";
  const values = {};
  const errors = {};

  for (const id of req.ids) {
    try {
      let project = defaultProject;
      let secretId = id;
      const slash = id.indexOf("/");
      if (!project && slash > 0 && slash < id.length - 1) {
        project = id.slice(0, slash);
        secretId = id.slice(slash + 1);
      }
      if (!project) {
        throw new Error("set OPENBZ_GCP_PROJECT or use id my-gcp-project/my-secret-id");
      }
      if (!secretId) throw new Error("empty secret id");
      values[id] = gcloudAccess(project, secretId);
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

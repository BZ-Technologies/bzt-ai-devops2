import fs from "node:fs/promises";
import path from "node:path";
import { resolveOpenBZAgentDir } from "./agent-paths.js";

export async function readGeneratedModelsJson<T>(): Promise<T> {
  const modelPath = path.join(resolveOpenBZAgentDir(), "models.json");
  const raw = await fs.readFile(modelPath, "utf8");
  return JSON.parse(raw) as T;
}

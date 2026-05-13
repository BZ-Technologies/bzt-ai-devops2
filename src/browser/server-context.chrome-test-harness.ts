import { vi } from "vitest";
import { installChromeUserDataDirHooks } from "./chrome-user-data-dir.test-harness.js";

const chromeUserDataDir = { dir: "/tmp/openbz" };
installChromeUserDataDirHooks(chromeUserDataDir);

vi.mock("./chrome.js", () => ({
  isChromeCdpReady: vi.fn(async () => true),
  isChromeReachable: vi.fn(async () => true),
  launchOpenBZChrome: vi.fn(async () => {
    throw new Error("unexpected launch");
  }),
  resolveOpenBZUserDataDir: vi.fn(() => chromeUserDataDir.dir),
  stopOpenBZChrome: vi.fn(async () => {}),
}));

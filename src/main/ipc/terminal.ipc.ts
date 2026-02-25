import fs from "node:fs";
import path from "node:path";
import { ipcMain } from "electron";
import {
  runTerminal,
  type TerminalRunRequest,
  type TerminalRunResult,
} from "../services/terminalRunner";

const WORKSPACE_NOT_SET_MESSAGE =
  "Workspace is not set for this chat. Please select a workspace folder using the button above the input before running terminal or file-patch commands.";

export function registerTerminalIpc(): void {
  ipcMain.handle(
    "run-terminal",
    async (_event, request: TerminalRunRequest): Promise<TerminalRunResult> => {
      const root = request.workspaceRoot?.trim();
      if (!root) {
        return {
          stdout: "",
          stderr: WORKSPACE_NOT_SET_MESSAGE,
          outcome: { type: "denied", reason: "workspace not set" },
          duration_ms: 0,
          truncated: false,
        };
      }
      try {
        const resolved = path.resolve(root);
        if (!fs.existsSync(resolved) || !fs.statSync(resolved).isDirectory()) {
          return {
            stdout: "",
            stderr: "Workspace path is invalid or not a directory.",
            outcome: { type: "denied", reason: "invalid workspace" },
            duration_ms: 0,
            truncated: false,
          };
        }
        return runTerminal({ request, workspaceRoot: resolved });
      } catch {
        return {
          stdout: "",
          stderr: "Workspace path is invalid.",
          outcome: { type: "denied", reason: "invalid workspace" },
          duration_ms: 0,
          truncated: false,
        };
      }
    }
  );
}

import fs from "node:fs";
import path from "node:path";
import { ipcMain } from "electron";
import {
  runFilePatch,
  type FilePatchRequest,
  type FilePatchResult,
} from "../services/filePatchRunner";
import {
  restoreCheckpoint,
  restoreCheckpoints,
} from "../services/filePatchCheckpoints";

const WORKSPACE_NOT_SET_MESSAGE =
  "Workspace is not set for this chat. Please select a workspace folder using the button above the input before running terminal or file-patch commands.";

export function registerFilePatchIpc(): void {
  ipcMain.handle(
    "apply-file-patch",
    async (_event, request: FilePatchRequest): Promise<FilePatchResult> => {
      const root = request.workspaceRoot?.trim();
      if (!root) {
        return {
          status: "error",
          files_changed: [],
          rejected_ops: [{ path: "", reason: WORKSPACE_NOT_SET_MESSAGE }],
          post_hashes: {},
        };
      }
      try {
        const resolved = path.resolve(root);
        if (!fs.existsSync(resolved) || !fs.statSync(resolved).isDirectory()) {
          return {
            status: "error",
            files_changed: [],
            rejected_ops: [
              {
                path: "",
                reason: "Workspace path is invalid or not a directory.",
              },
            ],
            post_hashes: {},
          };
        }
        return runFilePatch({ request, workspaceRoot: resolved });
      } catch {
        return {
          status: "error",
          files_changed: [],
          rejected_ops: [{ path: "", reason: "Workspace path is invalid." }],
          post_hashes: {},
        };
      }
    }
  );

  ipcMain.handle(
    "restore-file-patch-checkpoint",
    async (_event, checkpointId: string) => {
      return restoreCheckpoint(checkpointId);
    }
  );

  ipcMain.handle(
    "restore-file-patch-checkpoints",
    async (_event, checkpointIds: unknown) => {
      const ids = Array.isArray(checkpointIds)
        ? checkpointIds.filter((id): id is string => typeof id === "string")
        : [];
      return restoreCheckpoints(ids);
    }
  );
}

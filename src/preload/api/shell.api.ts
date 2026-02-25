import { ipcRenderer } from "electron";

export const shellApi = {
  openFolderDialog: () => ipcRenderer.invoke("open-folder-dialog"),
  openExternal: (url: string) => ipcRenderer.invoke("open-external", url),
};

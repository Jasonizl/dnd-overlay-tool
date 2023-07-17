import { contextBridge, ipcRenderer } from 'electron';

/* Exposed functions to use for the main.ts */
contextBridge.exposeInMainWorld('electron', {
  setGridSize: (size: number) => ipcRenderer.send('setGridSize', size),
  setGridColor: (color: string) => ipcRenderer.send('setGridColor', color),
  setGridThickness: (thickness: number) => ipcRenderer.send('setGridThickness', thickness),
  rotateDisplay: (displayIndex: number, rotation: number) => ipcRenderer.send('rotateDisplay', displayIndex, rotation),

  getDisplays: (cb: (displays: number, enabled: boolean) => void) =>
    ipcRenderer.on('getDisplays', (event, displays, enabled) => cb(displays, enabled)),
});

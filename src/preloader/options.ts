import { contextBridge, ipcRenderer, Display } from 'electron';

interface Item {
  name: string;
  id: number;
  type: Type;
  position?: Position;
  dimension?: Dimension;
  color?: string;
}


/* Exposed functions to use for the main.ts */
contextBridge.exposeInMainWorld('electron', {
  setGridSize: (size: number) => ipcRenderer.send('setGridSize', size),
  setGridColor: (color: string) => ipcRenderer.send('setGridColor', color),
  setGridThickness: (thickness: number) => ipcRenderer.send('setGridThickness', thickness),
  requestDisplays: () => ipcRenderer.send('requestDisplays'),
  rotateDisplay: (displayIndex: number, rotation: number) => ipcRenderer.send('rotateDisplay', displayIndex, rotation),

  addGridElement: (gridElement: Item) => ipcRenderer.send('addGridElement', gridElement),
  deleteGridElement: (elementIndex: number) => ipcRenderer.send('deleteGridElement', elementIndex),

  getDisplays: (cb: (displays: Display[], enabled: boolean) => void) =>
    ipcRenderer.on('getDisplays', (event, displays, enabled) => cb(displays, enabled)),
});

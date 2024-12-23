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
  toggleGrid: (active: boolean) => ipcRenderer.send('toggleGrid', active),
  setGridSize: (size: number) => ipcRenderer.send('setGridSize', size),
  setGridColor: (color: string) => ipcRenderer.send('setGridColor', color),
  setGridThickness: (thickness: number) => ipcRenderer.send('setGridThickness', thickness),
  requestDisplays: () => ipcRenderer.send('requestDisplays'),
  rotateDisplay: (displayIndex: number, rotation: number) => ipcRenderer.send('rotateDisplay', displayIndex, rotation),

  toggleCornerDetails: (active: boolean) => ipcRenderer.send('toggleCornerDetails', active),
  addGridElement: (gridElement: Item) => ipcRenderer.send('addGridElement', gridElement),
  moveGridElement: (elementId: number) => ipcRenderer.send('moveGridElement', elementId),
  changeGridElementColor: (elementIndex: number, color: string) => ipcRenderer.send('changeGridElementColor', elementIndex, color),
  setVisibilityGridElement: (elementId: number, active: boolean) => ipcRenderer.send('setVisibilityGridElement', elementId, active),
  deleteGridElement: (elementIndex: number) => ipcRenderer.send('deleteGridElement', elementIndex),

  getDisplays: (cb: (displays: Display[], enabled: boolean) => void) =>
    ipcRenderer.on('getDisplays', (event, displays, enabled) => cb(displays, enabled)),
  removeActiveElement: (cb: () => void) => ipcRenderer.on('removeActiveElement', (event) => cb()),
  resetActiveElement: (cb: () => void) => ipcRenderer.on('resetActiveElement', (event) => cb()),
});

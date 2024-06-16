import { contextBridge, ipcRenderer } from 'electron';

interface Item {
  name: string;
  id: number;
  type: Type;
  position?: Position;
  dimension?: Dimension;
}


// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  /*
    const replaceText = (selector: string, text: string) => {
      const element = document.getElementById(selector);
      if (element) {
        element.innerText = text;
      }
    };

    for (const type of ['chrome', 'node', 'electron']) {
      replaceText(`${type}-version`, process.versions[type as keyof NodeJS.ProcessVersions]);
    }*/
});

/* Exposed functions to use for the main.ts */
contextBridge.exposeInMainWorld('electron', {
  maximizeWindow: () => ipcRenderer.send('maximizeWindow'),
  minimizeWindows: () => ipcRenderer.send('minimizeWindows'),
  closeApp: () => ipcRenderer.send('closeApp'),
  resetActiveElement: () => ipcRenderer.send('resetActiveElement'),

  toggleGrid: (cb: (active: boolean) => void) => ipcRenderer.on('toggleGrid', (event, active) => cb(active)),
  setGridSize: (cb: (size: number) => void) => ipcRenderer.on('setGridSize', (event, size) => cb(size)),
  setGridColor: (cb: (color: string) => void) => ipcRenderer.on('setGridColor', (event, color) => cb(color)),
  setGridThickness: (cb: (thickness: number) => void) => ipcRenderer.on('setGridThickness', (event, thickness) => cb(thickness)),

  addGridElement: (cb: (gridElement: Item) => void) => ipcRenderer.on('addGridElement', (event, gridElement) => cb(gridElement)),
  moveGridElement: (cb: (elementId: number) => void) => ipcRenderer.on('moveGridElement', (event, elementId) => cb(elementId)),
  changeGridElementColor: (cb: (elementIndex: number, color: string) => void) => ipcRenderer.on('changeGridElementColor', (event, elementIndex, color) => cb(elementIndex, color)),
  setVisibilityGridElement: (cb: (elementId: number, active: boolean) => void) => ipcRenderer.on('setVisibilityGridElement', (event, elementId, active) => cb(elementId, active)),
  deleteGridElement: (cb: (elementIndex: number) => void) => ipcRenderer.on('deleteGridElement', (event, elementIndex) => cb(elementIndex)),

});

// https://github.com/electron-react-boilerplate/electron-react-boilerplate/blob/main/src/renderer/preload.d.ts

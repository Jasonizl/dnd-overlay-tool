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

  setGridSize: (cb: (size: number) => void) => ipcRenderer.on('setGridSize', (event, size) => cb(size)),
  setGridColor: (cb: (color: string) => void) => ipcRenderer.on('setGridColor', (event, color) => cb(color)),
  setGridThickness: (cb: (thickness: number) => void) => ipcRenderer.on('setGridThickness', (event, thickness) => cb(thickness)),

  addGridElement: (cb: (gridElement: Item) => void) => ipcRenderer.on('addGridElement', (event, gridElement) => cb(gridElement)),
  //deleteGridElement: (cb: (elementIndex: number) => void) => ipcRenderer.send('deleteGridElement', (event, elementIndex) => cb(elementIndex)),

});

// https://github.com/electron-react-boilerplate/electron-react-boilerplate/blob/main/src/renderer/preload.d.ts

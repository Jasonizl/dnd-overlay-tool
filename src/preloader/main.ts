import { contextBridge, ipcRenderer } from 'electron';

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
});

// https://github.com/electron-react-boilerplate/electron-react-boilerplate/blob/main/src/renderer/preload.d.ts

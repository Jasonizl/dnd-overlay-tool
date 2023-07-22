// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.

require('../helpers/main/listener.ts');
require('../helpers/main/canvas.ts');

/** Grid main->rerender ipc calls */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.electron.setGridSize((size: number) => {
  gridSize = size;
  drawGrid();
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.electron.setGridColor((color: string) => {
  gridColor = color;
  drawGrid();
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.electron.setGridThickness((thickness: number) => {
  gridThickness = thickness;
  drawGrid();
});

drawGrid();

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.

const maximizeButton = document.getElementById('buttonMaximize');
maximizeButton.addEventListener('click', () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.electron.maximizeWindow();
});

const minimizeButton = document.getElementById('buttonMinimize');
minimizeButton.addEventListener('click', () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.electron.minimizeWindows();
});

const closeButton = document.getElementById('buttonClose');
closeButton.addEventListener('click', () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.electron.closeApp();
});

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

/** Canvas handling **/
const canvas = document.getElementById('canvas') as HTMLCanvasElement;

// drag grid variables
let mouseStartX = 0;
let mouseStartY = 0;
let offsetX = 0;
let offsetY = 0;

let isMouseDown = false;

/* Canvas - LISTENERS */

canvas.addEventListener('mousedown', (e) => {
  // middle mouse button resets offset to 0
  if (e.button === 1) {
    offsetX = 0;
    offsetY = 0;
    drawGrid();
    return;
  }

  isMouseDown = true;
  mouseStartX = e.pageX + offsetX;
  mouseStartY = e.pageY + offsetY;
});

canvas.addEventListener('mouseup', (e) => {
  isMouseDown = false;
});

canvas.addEventListener('mousemove', (e) => {
  if (isMouseDown) {
    offsetX = mouseStartX - e.pageX;
    offsetY = mouseStartY - e.pageY;
    drawGrid();
  }
});

/* Canvas - LISTENERS END */
let gridSize = 80;
let gridColor = 'black';
let gridThickness = 1;

function drawGrid() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 25;
  const ctx = canvas.getContext('2d');

  // cleanup
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //grid width and height
  const bw = canvas.width;
  const bh = canvas.height;

  for (let x = offsetX; x <= bw; x += gridSize) {
    ctx.moveTo(0.5 + x, 0);
    ctx.lineTo(0.5 + x, bh);
  }

  for (let y = offsetY; y <= bh; y += gridSize) {
    ctx.moveTo(0, 0.5 + y);
    ctx.lineTo(bw, 0.5 + y);
  }

  ctx.strokeStyle = gridColor;
  ctx.lineWidth = gridThickness;
  ctx.stroke();
}

window.addEventListener('resize', () => {
  drawGrid();
});

drawGrid();

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

// are changed by the other event functions
/*eslint prefer-const: ["off", {"destructuring": "all"}]*/
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

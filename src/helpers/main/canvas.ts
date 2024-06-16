interface Position {
  x: number;
  y: number;
}

interface Dimension {
  width: number;
  height: number;
}

interface Item {
  name: string;
  id: number;
  type: Type;
  position?: Position;
  dimension?: Dimension;
  color?: string;
}


const canvas = document.getElementById('canvas') as HTMLCanvasElement;

// drag grid variables
let mouseStartX = 0;
let mouseStartY = 0;
let offsetX = 0;
let offsetY = 0;

let currentMouseX = 0
let currentMouseY = 0

let isMouseDown = false;
let scrolling = false;

/* Canvas - LISTENERS */
canvas.addEventListener('mousedown', (e) => {
  // middle mouse button resets offset to 0
  if(selectedElementIndex !== 0 || currentNotAddedDrawableObject !== undefined) {
    drawableObjects.push({...currentNotAddedDrawableObject, position: {x: currentMouseX - offsetX, y: currentMouseY - offsetY}, dimension: {width: gridElementUnit, height: gridElementUnit}});

    currentNotAddedDrawableObject = undefined;
    gridElementUnit = gridSize;
    selectedElementIndex = 0;

    // give back command to options window, to set/reset active row
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.electron.resetActiveElement();


    return;
  }

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
  }

  currentMouseX = e.pageX;
  currentMouseY = e.pageY;
  drawGrid()
});

canvas.addEventListener('wheel', (e) => {
  const radius = gridSize / 2
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (e.deltaY > 0) {
      gridElementUnit += radius
    } else {
      gridElementUnit = gridElementUnit <= radius ? radius : gridElementUnit - radius
    }
  drawGrid()

}, { passive: true });

/* Canvas - LISTENERS END */

// are changed by the other event functions
/*eslint prefer-const: ["off", {"destructuring": "all"}]*/
let gridSize = 80;
let gridColor = 'black';
let gridThickness = 1;
let gridElementUnit = gridSize

let selectedElementIndex = 0
let currentNotAddedDrawableObject: Item | undefined  = undefined
let drawableObjects: Item[] = []
const HEADER_HEIGHT = 25

function drawGrid() {

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - HEADER_HEIGHT;
  const ctx = canvas.getContext('2d');

  // cleanup
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // grid width and height
  const bw = canvas.width;
  const bh = canvas.height;
  ctx.beginPath();
  ctx.strokeStyle = gridColor;

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

  // grid end

  // draw function for new element
  if(selectedElementIndex !== 0) {
    ctx.beginPath();
    ctx.font = 'bold 14px sans-serif'

    // set color to the one of the to be drawn object, but with a small alpha value for transparency
    ctx.fillStyle = `${currentNotAddedDrawableObject?.color}33`;
    if (currentNotAddedDrawableObject.type === 'CircleAOE') {
      ctx.arc(currentMouseX, currentMouseY - HEADER_HEIGHT, gridElementUnit - 2, 0, 2 * Math.PI);
      ctx.fill();

      // border
      ctx.lineWidth = 3;
      ctx.strokeStyle = `${currentNotAddedDrawableObject?.color}bb`;


      // write information about current dimensions
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(`${((gridElementUnit / (gridSize / 2)) * 5) / 2} feet radius`, currentMouseX - 18, currentMouseY + 8);
      ctx.fillText(`${(gridElementUnit / (gridSize / 2)) * 5} feet diameter`, currentMouseX - 18, currentMouseY + 23);

    } else if (currentNotAddedDrawableObject.type === 'RectangleAOE') {
      ctx.fillRect(currentMouseX - (gridElementUnit/2), currentMouseY - (gridElementUnit/2) - HEADER_HEIGHT, gridElementUnit, gridElementUnit);

      // border
      ctx.lineWidth = 3;
      ctx.strokeStyle = `${currentNotAddedDrawableObject?.color}bb`;
      ctx.strokeRect(currentMouseX - (gridElementUnit/2), currentMouseY - (gridElementUnit/2) - HEADER_HEIGHT, gridElementUnit, gridElementUnit);


      // write information about current dimensions
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(`${((gridElementUnit / (gridSize / 2)) * 5) / 2} feet`, currentMouseX - 18, currentMouseY + 8);
    }


    ctx.stroke();
  }

  // draw all elements which are currently also (technically) in the table
  drawableObjects.forEach((element) => {
    const { type, position, color } = element;
    const dimensionUnit = element.dimension.width; // TODO to be adjusted, when its possible !== height

    ctx.beginPath();

    // set color to the one of the to be drawn object, but with a small alpha value for transparency
    ctx.fillStyle = `${color}33`;
    if (type === 'CircleAOE') {
      ctx.arc(offsetX + position.x, offsetY + position.y - HEADER_HEIGHT, dimensionUnit - 2, 0, 2 * Math.PI);
      ctx.fill();

      // border
      ctx.lineWidth = 3;
      ctx.strokeStyle = `${color}bb`;

    } else if (type === 'RectangleAOE') {
      ctx.fillRect(offsetX + position.x - (dimensionUnit/2), offsetY + position.y - (dimensionUnit/2) - HEADER_HEIGHT, dimensionUnit, dimensionUnit);

      // border
      ctx.lineWidth = 3;
      ctx.strokeStyle = `${color}bb`;
      ctx.strokeRect(offsetX + position.x - (dimensionUnit/2), offsetY + position.y - (dimensionUnit/2) - HEADER_HEIGHT, dimensionUnit, dimensionUnit);
    }

    ctx.stroke();
  });
  //ctx.strokeStyle = gridColor;
  //ctx.lineWidth = gridThickness;
  //ctx.stroke();
}

drawGrid()
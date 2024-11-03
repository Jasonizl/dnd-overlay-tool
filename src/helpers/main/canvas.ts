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
  visible?: boolean;
  position?: Position;
  dimension?: Dimension;
  color?: string;
  imageSrcUrl?: string;
  imageElement?: HTMLImageElement;
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
  if (e.button === 1) {
    offsetX = 0;
    offsetY = 0;
    drawGrid();
    return;
  }

  if (e.button === 2) {
    currentNotAddedDrawableObject = undefined;
    gridElementUnit = gridSize;
    selectedElementIndex = 0;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.electron.removeActiveElement();

    // give back command to options window, to set/reset active row
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.electron.resetActiveElement();

    drawGrid();
    return;
  }

  if(selectedElementIndex !== 0 || currentNotAddedDrawableObject !== undefined) {
    // special handling for ConeAOE
    if(currentNotAddedDrawableObject.type === 'ConeAOE' || currentNotAddedDrawableObject.type === 'MeasureRuler') {
      if(currentNotAddedDrawableObject.position === undefined) {
        currentNotAddedDrawableObject = {...currentNotAddedDrawableObject, position: {x: currentMouseX - offsetX, y: currentMouseY - offsetY}};

        // Cones have default angle of 60°
        if (currentNotAddedDrawableObject.type === 'ConeAOE') {
          gridElementUnit *= 2;
        }

        // we return early, because a second click has to be made when adding these types of objects
        return;
      } else {
        // second click, we will add the second position and add it to our drawableObjects. dimension being the angle
        if(currentNotAddedDrawableObject.type === 'ConeAOE') {
          drawableObjects.push({...currentNotAddedDrawableObject, position2: {x: currentMouseX - offsetX, y: currentMouseY - offsetY}, dimension: {width: Math.round((gridElementUnit / (gridSize / 2)) * 15), height: Math.round((gridElementUnit / (gridSize / 2)) * 15)}})
        } else if (currentNotAddedDrawableObject.type === 'MeasureRuler') {
          drawableObjects.push({...currentNotAddedDrawableObject, position2: {x: currentMouseX - offsetX, y: currentMouseY - offsetY}, dimension: {width: gridElementUnit, height: gridElementUnit}})
        }
      }
    } else {
      drawableObjects.push({...currentNotAddedDrawableObject, position: {x: currentMouseX - offsetX, y: currentMouseY - offsetY}, dimension: {width: gridElementUnit, height: gridElementUnit}});
    }

    currentNotAddedDrawableObject = undefined;
    gridElementUnit = gridSize;
    selectedElementIndex = 0;

    // give back command to options window, to set/reset active row
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.electron.resetActiveElement();
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
let gridElementUnit = gridSize;
let gridActive = true;
let cornerInformation = true;

let selectedElementIndex = 0;
let currentNotAddedDrawableObject: Item | undefined  = undefined;
let drawableObjects: Item[] = [];
const HEADER_HEIGHT = 25;

/**
 * sets the styling for shadowed text
 */
function setFontStyling(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = "rgba(0,0,0,1)";
  ctx.shadowBlur = 5;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

/**
 * function to write detailed information about current aoe in all corners for more readability on table
 */
function drawCornerInformation(ctx: CanvasRenderingContext2D, text: string, yOffset: number = 0) {
  if (!cornerInformation) {
    return;
  }

  ctx.fillText(text, 0, HEADER_HEIGHT + yOffset); // upper left
  ctx.fillText(text, 0, canvas.height - HEADER_HEIGHT + yOffset); // upper right
  ctx.fillText(text, canvas.width - ctx.measureText(text).width, 0 + HEADER_HEIGHT + yOffset); // lower left
  ctx.fillText(text, canvas.width - ctx.measureText(text).width, canvas.height - HEADER_HEIGHT + yOffset); // lower right
}

function drawGrid() {

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - HEADER_HEIGHT;
  const ctx = canvas.getContext('2d');

  // cleanup
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // start grid
  // render grid only when its set active (default=true)
  if(gridActive) {
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
  }

  // grid end

  // draw all elements which are currently also (technically) in the table (not newly added elements)
  drawableObjects.forEach((element) => {
    const { type, position, position2, color, imageElement, visible } = element;
    const dimensionUnit = element.dimension.width; // TODO to be adjusted, when its possible !== height

    // if element visibility is set to false, skip render process for this element
    if(!visible) { return; }

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
    } else if (type === 'CircleImage') {
      // border
      ctx.lineWidth = 3;
      ctx.strokeStyle = `${color}bb`;

      ctx.save();
      ctx.beginPath();
      ctx.arc(offsetX + position.x, offsetY + position.y - HEADER_HEIGHT, dimensionUnit - 2, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(imageElement, offsetX + position.x - dimensionUnit , offsetY + position.y - dimensionUnit - HEADER_HEIGHT, dimensionUnit*2, dimensionUnit*2);

      ctx.beginPath();
      ctx.arc(offsetX + position.x, offsetY + position.y - HEADER_HEIGHT, dimensionUnit - 2, 0, Math.PI * 2, true);
      ctx.clip();
      ctx.closePath();
      ctx.restore();
    } else if (type === 'RectangleImage') {
      ctx.drawImage(imageElement, offsetX + position.x - (dimensionUnit/2), offsetY + position.y - (dimensionUnit/2) - HEADER_HEIGHT, dimensionUnit, dimensionUnit);

      // border
      ctx.lineWidth = 3;
      ctx.strokeStyle = `${color}bb`;
      ctx.strokeRect(offsetX + position.x - (dimensionUnit/2), offsetY + position.y - (dimensionUnit/2) - HEADER_HEIGHT, dimensionUnit, dimensionUnit);
    } else if (type === 'ConeAOE') {
      const p1 = {x: offsetX + position.x, y: offsetY + position.y - HEADER_HEIGHT};
      const p2 = {x: offsetX + position2.x, y: offsetY + position2.y - HEADER_HEIGHT};

      // minimum of 15 degrees for the cone
      const coneAngle = dimensionUnit;

      // euclidean distance https://stackoverflow.com/a/20916978/22217480 to get the height of the cone
      const h = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
      const base = 2 * h * Math.tan(((coneAngle * Math.PI) / 180) / 2);

      // get rotation with starting point from p1
      const rotationVector = {x: p2.x - p1.x, y: p2.y - p1.y};
      const rotation = Math.atan2(rotationVector.y, rotationVector.x) + (Math.PI / 2)
      const rotationDegree = rotation * (180 / Math.PI);

      // positions of the two other points in the triangle (basic formula) based of p2
      const coneP1 = {x: p2.x + (-1 * (base / 2)), y: p2.y}
      const coneP2 = {x: p2.x + (base / 2), y: p2.y}

      // adjusted positions with rotation in relation to p2 (p2 is the center of both of these)
      const rotatedConeP1 = {x: p2.x + ((coneP1.x - p2.x) * Math.cos(rotation)) - ((coneP1.y - p2.y) * Math.sin(rotation)), y: p2.y + ((coneP1.x - p2.x) * Math.sin(rotation)) + ((coneP1.y - p2.y) * Math.cos(rotation))}
      const rotatedConeP2 = {x: p2.x + ((coneP2.x - p2.x) * Math.cos(rotation)) - ((coneP2.y - p2.y) * Math.sin(rotation)), y: p2.y + ((coneP2.x - p2.x) * Math.sin(rotation)) + ((coneP2.y - p2.y) * Math.cos(rotation))}

      const cone = new Path2D();
      cone.moveTo(p1.x, p1.y);
      cone.lineTo(rotatedConeP1.x, rotatedConeP1.y);
      cone.lineTo(rotatedConeP2.x, rotatedConeP2.y);
      cone.lineTo(p1.x, p1.y);
      cone.closePath();

      ctx.fill(cone, 'nonzero')

      ctx.lineWidth = 3;
      ctx.strokeStyle = `${color}bb`;
      ctx.stroke(cone);
    } else if (type === 'MeasureRuler') {
      const p1 = {x: position.x + offsetX, y: position.y - HEADER_HEIGHT + offsetY}; // we add offset because when saved we removed it
      const p2 = {x: offsetX + position2.x, y: offsetY + position2.y - HEADER_HEIGHT};

      // border, stroke is changeable via. gridElementUnit
      ctx.lineWidth = 3 * (dimensionUnit / (gridSize / 2));
      ctx.strokeStyle = `${color}bb`;

      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);

      // we calculate both, direct and "indirect" distance and show it. Up for DM to use what they prefer
      const euclideanDist = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
      const roundtripDist = Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y); // its not called roundtrip, but forget the mathematical term

      // normalize absolute values to grid size
      const roundedEuclideanDistToGrid = Math.round((euclideanDist / gridSize) * 5);
      const roundedRoundtripDistToGrid = Math.round((roundtripDist / gridSize) * 5);
    }

    ctx.stroke();
  });

  // draw function for new element
  if(selectedElementIndex !== 0) {
    ctx.beginPath();
    ctx.font = 'bold 16px sans-serif'

    // set color to the one of the to be drawn object, but with a small alpha value for transparency
    ctx.fillStyle = `${currentNotAddedDrawableObject?.color}33`;
    if (currentNotAddedDrawableObject.type === 'CircleAOE') {
      ctx.arc(currentMouseX, currentMouseY - HEADER_HEIGHT, gridElementUnit - 2, 0, 2 * Math.PI);
      ctx.fill();

      // border
      ctx.lineWidth = 3;
      ctx.strokeStyle = `${currentNotAddedDrawableObject?.color}bb`;

      ctx.stroke();
      ctx.beginPath();

      // write information about current dimensions
      setFontStyling(ctx);
      const circleRadiusText = `${((gridElementUnit / (gridSize / 2)) * 5) / 2} feet radius`
      const circleDiameterText = `${(gridElementUnit / (gridSize / 2)) * 5} feet diameter`

      ctx.fillText(circleRadiusText, currentMouseX - 18, currentMouseY + 8);
      ctx.fillText(circleDiameterText, currentMouseX - 18, currentMouseY + 23);
      drawCornerInformation(ctx, circleRadiusText)
      drawCornerInformation(ctx, circleDiameterText, 15)
    } else if (currentNotAddedDrawableObject.type === 'RectangleAOE') {
      ctx.fillRect(currentMouseX - (gridElementUnit/2), currentMouseY - (gridElementUnit/2) - HEADER_HEIGHT, gridElementUnit, gridElementUnit);

      // border
      ctx.lineWidth = 3;
      ctx.strokeStyle = `${currentNotAddedDrawableObject?.color}bb`;
      ctx.strokeRect(currentMouseX - (gridElementUnit/2), currentMouseY - (gridElementUnit/2) - HEADER_HEIGHT, gridElementUnit, gridElementUnit);

      // write information about current dimensions
      setFontStyling(ctx);
      const cubeSizeText = `${((gridElementUnit / (gridSize / 2)) * 5) / 2} feet`

      ctx.fillText(cubeSizeText, currentMouseX - 18, currentMouseY + 8);
      ctx.fillText(cubeSizeText, currentMouseX - (gridElementUnit/2), currentMouseY - (gridElementUnit/2) - HEADER_HEIGHT);
      drawCornerInformation(ctx, cubeSizeText)
    } else if (currentNotAddedDrawableObject.type === 'CircleImage') {
      // border
      ctx.lineWidth = 3;
      ctx.strokeStyle = `${currentNotAddedDrawableObject?.color}bb`;

      ctx.save();
      ctx.beginPath();
      ctx.arc(currentMouseX, currentMouseY - HEADER_HEIGHT, gridElementUnit - 2, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(currentNotAddedDrawableObject.imageElement, currentMouseX - gridElementUnit , currentMouseY - gridElementUnit - HEADER_HEIGHT, gridElementUnit*2, gridElementUnit*2);

      ctx.beginPath();
      ctx.arc(currentMouseX, currentMouseY - HEADER_HEIGHT, gridElementUnit - 2, 0, Math.PI * 2, true);
      ctx.clip();
      ctx.closePath();
      ctx.restore();
    } else if (currentNotAddedDrawableObject.type === 'RectangleImage') {

      ctx.drawImage(currentNotAddedDrawableObject.imageElement, currentMouseX - (gridElementUnit/2), currentMouseY - (gridElementUnit/2) - HEADER_HEIGHT, gridElementUnit, gridElementUnit);

      // border
      ctx.lineWidth = 3;
      ctx.strokeStyle = `${currentNotAddedDrawableObject?.color}bb`;
      ctx.strokeRect(currentMouseX - (gridElementUnit/2), currentMouseY - (gridElementUnit/2) - HEADER_HEIGHT, gridElementUnit, gridElementUnit);
    } else if (currentNotAddedDrawableObject.type === 'ConeAOE') {

      // only draw a dot to highlight starting point, if there is no position set right now
      if (currentNotAddedDrawableObject.position === undefined) {
        ctx.arc(currentMouseX, currentMouseY - HEADER_HEIGHT, 5, 0, 2 * Math.PI); // TODO something is wonky here when grid is moved
        ctx.fill();

        ctx.lineWidth = 3;
        ctx.strokeStyle = `${currentNotAddedDrawableObject?.color}ff`;
      }
      // otherwise we draw the to be drawn cone, because we have the starting position
      else {
        const p1 = {x: currentNotAddedDrawableObject.position.x + offsetX, y: currentNotAddedDrawableObject.position.y - HEADER_HEIGHT + offsetY}; // we add offset because when saved we removed it
        const p2 = {x: currentMouseX, y: currentMouseY - HEADER_HEIGHT};

        // minimum of 15 degrees for the cone
        const coneAngle = (gridElementUnit / (gridSize / 2)) * 15

        // euclidean distance https://stackoverflow.com/a/20916978/22217480 to get the height of the cone
        const h = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
        const base = 2 * h * Math.tan(((coneAngle * Math.PI) / 180) / 2);

        // get rotation with starting point from p1
        const rotationVector = {x: p2.x - p1.x, y: p2.y - p1.y};
        const rotation = Math.atan2(rotationVector.y, rotationVector.x) + (Math.PI / 2)
        const rotationDegree = rotation * (180 / Math.PI);

        // positions of the two other points in the triangle (basic formula) based of p2
        const coneP1 = {x: p2.x + (-1 * (base / 2)), y: p2.y}
        const coneP2 = {x: p2.x + (base / 2), y: p2.y}

        // adjusted positions with rotation in relation to p2 (p2 is the center of both of these)
        const rotatedConeP1 = {x: p2.x + ((coneP1.x - p2.x) * Math.cos(rotation)) - ((coneP1.y - p2.y) * Math.sin(rotation)), y: p2.y + ((coneP1.x - p2.x) * Math.sin(rotation)) + ((coneP1.y - p2.y) * Math.cos(rotation))}
        const rotatedConeP2 = {x: p2.x + ((coneP2.x - p2.x) * Math.cos(rotation)) - ((coneP2.y - p2.y) * Math.sin(rotation)), y: p2.y + ((coneP2.x - p2.x) * Math.sin(rotation)) + ((coneP2.y - p2.y) * Math.cos(rotation))}

        const cone = new Path2D();
        cone.moveTo(p1.x, p1.y);
        cone.lineTo(rotatedConeP1.x, rotatedConeP1.y);
        cone.lineTo(rotatedConeP2.x, rotatedConeP2.y);
        cone.lineTo(p1.x, p1.y);
        cone.closePath();

        ctx.fill(cone, 'nonzero')

        ctx.lineWidth = 3;
        ctx.strokeStyle = `${currentNotAddedDrawableObject?.color}ff`;
        ctx.stroke(cone);

        // write information about current dimensions
        setFontStyling(ctx);
        const coneLengthText = `${Math.round(((h / (gridSize / 2)) * 5) / 2)} feet`;

        ctx.fillText(coneLengthText, p1.x - 18, p1.y + 18);
        ctx.fillText(`${coneAngle}°`, p1.x - 18, p1.y + 33);

        ctx.fillText(coneLengthText, p2.x - 18, p2.y + 33);
        ctx.fillText(`${coneAngle}°`, p2.x - 18, p2.y + 48);

        drawCornerInformation(ctx, coneLengthText)
        drawCornerInformation(ctx, `${coneAngle}°`, 15)
      }
    } else if (currentNotAddedDrawableObject.type === 'MeasureRuler') {
      // only draw a dot to highlight starting point, if there is no position set right now
      if (currentNotAddedDrawableObject.position === undefined) {
        ctx.arc(currentMouseX, currentMouseY - HEADER_HEIGHT, 5, 0, 2 * Math.PI); // TODO something is wonky here when grid is moved
        ctx.fill();

        ctx.lineWidth = 3;
        ctx.strokeStyle = `${currentNotAddedDrawableObject?.color}ff`;
      }
      // otherwise we draw a line from point 1 to point 2
      else {
        const p1 = {x: currentNotAddedDrawableObject.position.x + offsetX, y: currentNotAddedDrawableObject.position.y - HEADER_HEIGHT + offsetY}; // we add offset because when saved we removed it
        const p2 = {x: currentMouseX, y: currentMouseY - HEADER_HEIGHT};

        // border, stroke is changeable via. gridElementUnit
        ctx.lineWidth = 3 * (gridElementUnit / (gridSize / 2));
        ctx.strokeStyle = `${currentNotAddedDrawableObject?.color}bb`;

        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);

        // we calculate both, direct and "indirect" distance and show it. Up for DM to use what they prefer
        const euclideanDist = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
        const roundtripDist = Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y); // its not called roundtrip, but forget the mathematical term

        // normalize absolute values to grid size
        const roundedEuclideanDistToGrid = Math.round((euclideanDist / gridSize) * 5);
        const roundedRoundtripDistToGrid = Math.round((roundtripDist / gridSize) * 5);
        ctx.stroke();
        ctx.beginPath();

        setFontStyling(ctx);

        ctx.fillText(`${roundedEuclideanDistToGrid} (euclidean) feet`, p1.x - 18, p1.y + HEADER_HEIGHT);
        ctx.fillText(`${roundedRoundtripDistToGrid} (roundtrip) feet`, p1.x - 18, p1.y + 15 + HEADER_HEIGHT);

        ctx.fillText(`${roundedEuclideanDistToGrid} (euclidean) feet`, currentMouseX - 18, currentMouseY + 15);
        ctx.fillText(`${roundedRoundtripDistToGrid} (roundtrip) feet`, currentMouseX - 18, currentMouseY + 30);

        drawCornerInformation(ctx, `${roundedEuclideanDistToGrid} (euclidean) feet`);
        drawCornerInformation(ctx, `${roundedRoundtripDistToGrid} (roundtrip) feet`, 15);
      }
    }

    ctx.stroke();
  }
}

drawGrid()
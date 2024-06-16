interface Item {
  name: string;
  id: number;
  type: Type;
  position?: Position;
  dimension?: Dimension;
  color?: string
}


// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.

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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.electron.toggleGrid((active: boolean) => {
  gridActive = active;
  drawGrid();
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.electron.addGridElement((gridElement: Item) => {
  console.log(gridElement);


  // if we have a element in queue to be added, but not set yet, we will att it anyways at a undefined position
  if (selectedElementIndex !== 0 &&
    !drawableObjects.some((obj) => obj.id === currentNotAddedDrawableObject.id &&
    gridElement.id !== currentNotAddedDrawableObject.id))
  {
    drawableObjects.push({...currentNotAddedDrawableObject, position: {x: -1000, y: -1000}, dimension: {width: gridElementUnit, height: gridElementUnit}});
  }

  selectedElementIndex = gridElement.id

  // when we handle a image type element, we want to create the img here for the ctx/canvas later to draw
  if (gridElement.type === 'CircleImage' || gridElement.type === 'RectangleImage') {
    const newImageElement = document.createElement("img");
    newImageElement.src = gridElement.imageSrcUrl;

    currentNotAddedDrawableObject = { ...gridElement, imageElement: newImageElement}
  } else {
    currentNotAddedDrawableObject = gridElement
  }

  // don't draw grid, because it will render it at weird position on map when mouse is not there
  //drawGrid();
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.electron.moveGridElement((elementId: number) => {
  if(elementId === selectedElementIndex) return; // dont act when the same element is selected

  selectedElementIndex = elementId;
  currentNotAddedDrawableObject = drawableObjects.find((obj) => obj.id === elementId);
  gridElementUnit = currentNotAddedDrawableObject.dimension.width; // only works as long as everything has same length (width/height)

  // remove the to be moved element from the drawn static elements
  drawableObjects = drawableObjects.filter((obj) => obj.id !== elementId);

  //drawGrid();
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.electron.deleteGridElement((elementIndex: number) => {
  drawableObjects = drawableObjects.filter((obj) => obj.id !== elementIndex);

  // reset to ground zero
  if (currentNotAddedDrawableObject.id === elementIndex) {
    currentNotAddedDrawableObject = undefined
    selectedElementIndex = 0;
  }
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.electron.changeGridElementColor((elementIndex: number, color: string) => {
  drawableObjects.find((obj) => obj.id === elementIndex).color = color;

  drawGrid();
});

drawGrid();

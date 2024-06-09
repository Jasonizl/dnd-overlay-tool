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
window.electron.addGridElement((gridElement: Item) => {
  console.log('ADD GRID ELEMENT')

  selectedElementIndex = gridElement.id
  currentNotAddedDrawableObject = gridElement

  console.log(currentNotAddedDrawableObject)
  //drawGrid();
});


// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.electron.deleteGridElement((elementIndex: number) => {
  console.log('DELETE GRID ELEMENT')
  //drawGrid();
});

drawGrid();

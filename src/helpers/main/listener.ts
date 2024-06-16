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

// add functionality to increase/decrease size also via keyboard
window.addEventListener('keydown', (e) => {
  const radius = gridSize / 2

  if (e.key === '+') {
    gridElementUnit += radius
  } else if (e.key === '-') {
    gridElementUnit = gridElementUnit <= radius ? radius : gridElementUnit - radius
  }

  drawGrid();
});


window.addEventListener('resize', () => {
  drawGrid();
});

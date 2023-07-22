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

window.addEventListener('resize', () => {
  drawGrid();
});

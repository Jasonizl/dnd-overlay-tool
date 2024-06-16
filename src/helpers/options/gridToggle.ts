const gridToggleButton = document.getElementById('gridToggle');

gridToggleButton.addEventListener('click', (e) => {
  const active = !gridToggleButton.innerText.includes('✅');

  if (active) {
    gridToggleButton.innerText = gridToggleButton.innerText.replace('⛔', '✅')
  } else {
    gridToggleButton.innerText = gridToggleButton.innerText.replace('✅', '⛔')
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.electron.toggleGrid(active);
});

const cornerInformationToggleButton = document.getElementById('cornerInformationToggle');

cornerInformationToggleButton.addEventListener('click', (e) => {
  const active = !cornerInformationToggleButton.innerText.includes('✅');

  if (active) {
    cornerInformationToggleButton.innerText = cornerInformationToggleButton.innerText.replace('⛔', '✅')
  } else {
    cornerInformationToggleButton.innerText = cornerInformationToggleButton.innerText.replace('✅', '⛔')
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.electron.toggleCornerDetails(active);
});

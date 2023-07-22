const currentDisplayRotation: number[] = [];

// can be used to request the displays again. will remove all current displays
// Will not load the script new
const displayRequestButton = document.getElementById('reloadDisplays');
displayRequestButton.addEventListener('click', () => {
  const displayDiv = document.getElementById('displays');
  displayDiv.innerHTML = '';

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.electron.requestDisplays();
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.electron.getDisplays((displays: number, enabled: boolean) => {
  const displayDiv = document.getElementById('displays');

  for (let display = 1; display <= displays; display++) {
    currentDisplayRotation.push(0);

    // outer div
    const newDisplayItem = document.createElement('div');
    newDisplayItem.className = 'displayItem';

    const header = document.createElement('h6');
    header.innerText = `Display ${display}`;

    const rotateButton = document.createElement('button');
    rotateButton.id = `rotationButton${display}`;
    rotateButton.innerText = '🖥️ 0°';
    rotateButton.disabled = !enabled;

    const resetButton = document.createElement('button');
    resetButton.id = `resetRotationButton${display}`;
    resetButton.innerText = 'reset';
    resetButton.disabled = !enabled;

    if (!enabled) {
      rotateButton.title = 'button disabled because rotation script could not be found.';
      resetButton.title = 'button disabled because rotation script could not be found.';
    } else {
      // Add all functionality to the buttons and change the naming of the buttons
      // to current rotation values

      rotateButton.addEventListener('click', () => {
        const newRotation = currentDisplayRotation[display - 1] + 1;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.electron.rotateDisplay(display, newRotation);
        rotateButton.innerText = `🖥️ ${(newRotation * 90) % 360}`;
        currentDisplayRotation[display - 1] = newRotation % 4;
      });

      resetButton.addEventListener('click', () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.electron.rotateDisplay(display, 0);
        rotateButton.innerText = `🖥️ 0`;
        currentDisplayRotation[display - 1] = 0;
      });
    }

    newDisplayItem.appendChild(header);
    newDisplayItem.appendChild(rotateButton);
    newDisplayItem.appendChild(resetButton);

    displayDiv.appendChild(newDisplayItem);
  }
});

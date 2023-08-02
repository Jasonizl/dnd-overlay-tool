let currentDisplayRotation: number[] = [];
let initialDisplayRotation: number[] = [];

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
window.electron.getDisplays((displays: any[], enabled: boolean) => {
  const displayDiv = document.getElementById('displays');
  currentDisplayRotation = [];

  for (let displayIndex = 1; displayIndex <= displays.length; displayIndex++) {
    currentDisplayRotation.push(Math.floor((displays[displayIndex - 1].rotation % 360) / 90));

    // outer div
    const newDisplayItem = document.createElement('div');
    newDisplayItem.className = 'displayItem';

    const header = document.createElement('h6');
    header.innerText = `Display ${displayIndex} ${displays[displayIndex - 1].label}`;

    const rotateButton = document.createElement('button');
    rotateButton.id = `rotationButton${displayIndex}`;
    rotateButton.innerText = `🖥️ ${displays[displayIndex - 1].rotation % 360}°`;
    rotateButton.disabled = !enabled;

    const resetButton = document.createElement('button');
    resetButton.id = `resetRotationButton${displayIndex}`;
    resetButton.innerText = 'reset';
    resetButton.disabled = !enabled;

    if (!enabled) {
      rotateButton.title = 'button disabled because rotation script could not be found.';
      resetButton.title = 'button disabled because rotation script could not be found.';
    } else {
      // Add all functionality to the buttons and change the naming of the buttons
      // to current rotation values

      rotateButton.addEventListener('click', () => {
        const newRotation = currentDisplayRotation[displayIndex - 1] + 1;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.electron.rotateDisplay(displayIndex, newRotation);
        rotateButton.innerText = `🖥️ ${(newRotation * 90) % 360}`;
        currentDisplayRotation[displayIndex - 1] = newRotation % 4;
      });

      resetButton.addEventListener('click', () => {
        const displayRotation = initialDisplayRotation[displayIndex - 1];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.electron.rotateDisplay(displayIndex, displayRotation);
        rotateButton.innerText = `🖥️ displayRotation * 90}`;
        currentDisplayRotation[displayIndex - 1] = displayRotation;
      });
    }

    newDisplayItem.appendChild(header);
    newDisplayItem.appendChild(rotateButton);
    newDisplayItem.appendChild(resetButton);

    initialDisplayRotation = [...currentDisplayRotation];
    displayDiv.appendChild(newDisplayItem);
  }
});

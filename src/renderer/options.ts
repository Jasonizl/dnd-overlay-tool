const gridSizeInput = document.getElementById('gridSizeInput');
const gridSizeButtonMinus = document.getElementById('gridSizeButtonMinus');
const gridSizeButtonMinusBig = document.getElementById('gridSizeButtonMinusBig');
const gridSizeButtonPlus = document.getElementById('gridSizeButtonPlus');
const gridSizeButtonPlusBig = document.getElementById('gridSizeButtonPlusBig');

let gridSizeValue = 80;
let gridThicknessOptions = 1;

gridSizeInput.addEventListener('change', (e) => {
  e.preventDefault();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const value = e.currentTarget.value;
  changeGridSize(value);
});

gridSizeButtonMinus.addEventListener('click', () => {
  changeGridSize(String(gridSizeValue - 5));
});

gridSizeButtonMinusBig.addEventListener('click', () => {
  changeGridSize(String(gridSizeValue - 10));
});

gridSizeButtonPlus.addEventListener('click', () => {
  changeGridSize(String(gridSizeValue + 5));
});

gridSizeButtonPlusBig.addEventListener('click', () => {
  changeGridSize(String(gridSizeValue + 10));
});

function changeGridSize(size: string) {
  // allow a maximum of 3 digits only
  if (!new RegExp('^([1-9][0-9]{0,2})$').test(size)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    gridSizeInput.value = String(gridSizeValue);
    return;
  }

  gridSizeValue = Number(size);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  gridSizeInput.value = String(gridSizeValue);

  // if value does not exists, return to default value
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.electron.setGridSize(Number(size));
}

const gridBorderColorPicker = document.getElementById('borderColorPicker');
gridBorderColorPicker.addEventListener('change', (e) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.electron.setGridColor(e.currentTarget.value);
});

const gridThicknessButtonMinus = document.getElementById('gridThicknessButtonMinus');
const gridThicknessButtonPlus = document.getElementById('gridThicknessButtonPlus');

gridThicknessButtonMinus.addEventListener('click', () => {
  changeGridThickness(String(gridThicknessOptions - 1));
});

gridThicknessButtonPlus.addEventListener('click', () => {
  changeGridThickness(String(gridThicknessOptions + 1));
});

function changeGridThickness(thickness: string) {
  // allow a maximum of 3 digits only
  if (!new RegExp('^[1-5]$').test(thickness)) {
    return;
  }

  gridThicknessOptions = Number(thickness);

  // if value does not exists, return to default value
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.electron.setGridThickness(Number(thickness));
}

/* Rotation stuff */
const currentDisplayRotation: number[] = [];

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

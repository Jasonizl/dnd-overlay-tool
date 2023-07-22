const gridSizeInput = document.getElementById('gridSizeInput');
const gridSizeButtonMinus = document.getElementById('gridSizeButtonMinus');
const gridSizeButtonMinusBig = document.getElementById('gridSizeButtonMinusBig');
const gridSizeButtonPlus = document.getElementById('gridSizeButtonPlus');
const gridSizeButtonPlusBig = document.getElementById('gridSizeButtonPlusBig');

let gridSizeValue = 80;

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

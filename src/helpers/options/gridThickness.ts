const gridThicknessButtonMinus = document.getElementById('gridThicknessButtonMinus');
const gridThicknessButtonPlus = document.getElementById('gridThicknessButtonPlus');

let gridThicknessOptions = 1;

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

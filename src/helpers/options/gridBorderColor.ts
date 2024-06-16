const gridBorderColorPicker = document.getElementById('borderColorPicker');

gridBorderColorPicker.addEventListener('input', (e) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.electron.setGridColor(e.currentTarget.value);
});

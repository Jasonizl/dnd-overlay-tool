const gridBorderColorPicker = document.getElementById('borderColorPicker');

gridBorderColorPicker.addEventListener('change', (e) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.electron.setGridColor(e.currentTarget.value);
});

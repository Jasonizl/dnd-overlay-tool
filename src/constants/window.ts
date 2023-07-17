import BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;

export const mainWindowOptions: BrowserWindowConstructorOptions = {
  height: 600,
  width: 800,
};

export const optionsWindowOptions: BrowserWindowConstructorOptions = {
  title: 'DnD Overlay Tool - Options',
  height: 600,
  width: 300,
};

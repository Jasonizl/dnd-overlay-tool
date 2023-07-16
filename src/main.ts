import { app, BrowserWindow, ipcMain, screen } from 'electron';
import * as path from 'path';
import { mainWindowSize, optionsWindowSize } from './constants/window';
import { closeApplication } from './helpers/app';

let mainWindowId = -1;

function createOptionsWindow() {
  const optionsWindow = new BrowserWindow({
    ...optionsWindowSize,
    webPreferences: {
      preload: path.join(__dirname, 'preloader/options.js'),
    },
  });

  // and load the options.html of the app.
  optionsWindow.loadFile(path.join(__dirname, '../options.html'));
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    ...mainWindowSize,
    webPreferences: {
      preload: path.join(__dirname, 'preloader/main.js'),
    },
    transparent: true,
    frame: false,
    resizable: true,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '../index.html'));
  mainWindowId = mainWindow.id;

  // TODO to be removed when not needed anymore
  //mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  createOptionsWindow();

  /**
   * maximize when not maximized - otherwise bring it back to default size
   */
  ipcMain.on('maximizeWindow', () => {
    const mainWindow = BrowserWindow.fromId(mainWindowId);
    const currentDisplay = screen.getDisplayNearestPoint({
      x: mainWindow.getPosition()[0],
      y: mainWindow.getPosition()[1],
    });

    if (currentDisplay.workArea.width === mainWindow.getSize()[0] && currentDisplay.workArea.height === mainWindow.getSize()[1]) {
      mainWindow.setSize(mainWindowSize.width, mainWindowSize.height);
    } else {
      mainWindow.setSize(currentDisplay.workArea.width, currentDisplay.workArea.height);
    }

    mainWindow.center();
  });

  /**
   * minimize all windows, when main window wants to be minimized
   */
  ipcMain.on('minimizeWindows', () => {
    BrowserWindow.getAllWindows().forEach((window) => window.minimize());
  });

  /**
   * closes app. Called from X button of main window
   */
  ipcMain.on('closeApp', () => closeApplication());

  ipcMain.on('setGridSize', (event, args) => {
    const mainWindow = BrowserWindow.fromId(mainWindowId);
    mainWindow.webContents.send('setGridSize', args);
  });

  ipcMain.on('setGridColor', (event, args) => {
    const mainWindow = BrowserWindow.fromId(mainWindowId);
    mainWindow.webContents.send('setGridColor', args);
  });

  ipcMain.on('setGridThickness', (event, args) => {
    const mainWindow = BrowserWindow.fromId(mainWindowId);
    mainWindow.webContents.send('setGridThickness', args);
  });

  // for executing rotation program https://ourcodeworld.com/articles/read/154/how-to-execute-an-exe-file-system-application-using-electron-framework

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
      createOptionsWindow();
    }
  });
});

app.on('window-all-closed', () => closeApplication());

import { app, BrowserWindow, ipcMain, screen } from 'electron';
import * as path from 'path';
import { mainWindowOptions, optionsWindowOptions } from './constants/window';
import { closeApplication } from './helpers/app';
import { execFile } from 'child_process';
import * as fs from 'fs';

let mainWindowId = -1;
let optionsWindowId = -1;
let doesRotationScriptExist: boolean;

function createOptionsWindow() {
  const optionsWindow = new BrowserWindow({
    ...optionsWindowOptions,
    webPreferences: {
      preload: path.join(__dirname, 'preloader/options.js'),
    },
  });
  optionsWindowId = optionsWindow.id;

  const displays = screen.getAllDisplays();
  doesRotationScriptExist = fs.existsSync('./ScreenOrientationChangeTool.exe');

  optionsWindow.loadFile(path.join(__dirname, '../options.html'));
  optionsWindow.webContents.send('getDisplays', displays, doesRotationScriptExist);
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    ...mainWindowOptions,
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
      mainWindow.setSize(mainWindowOptions.width, mainWindowOptions.height);
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

  /**
   * closes app. Called from X button of main window
   */
  ipcMain.on('resetActiveElement', () => {
    const optionsWindow = BrowserWindow.fromId(optionsWindowId);
    optionsWindow.webContents.send('resetActiveElement');
  });

  /**
   * sets grid size of main window
   * IPC from options renderer to main renderer
   */
  ipcMain.on('setGridSize', (event, args) => {
    const mainWindow = BrowserWindow.fromId(mainWindowId);
    mainWindow.webContents.send('setGridSize', args);
  });

  /**
   * sets grid color of main window
   * IPC from options renderer to main renderer
   */
  ipcMain.on('setGridColor', (event, args) => {
    const mainWindow = BrowserWindow.fromId(mainWindowId);
    mainWindow.webContents.send('setGridColor', args);
  });

  /**
   * sets grid thickness of main window
   * IPC from options renderer to main renderer
   */
  ipcMain.on('setGridThickness', (event, args) => {
    const mainWindow = BrowserWindow.fromId(mainWindowId);
    mainWindow.webContents.send('setGridThickness', args);
  });

  /**
   * sets whether grid should be rendered or not
   * IPC from options renderer to main renderer
   */
  ipcMain.on('toggleGrid', (event, active) => {
    const mainWindow = BrowserWindow.fromId(mainWindowId);
    mainWindow.webContents.send('toggleGrid', active);
  });


  /**
   * adds new grid element chosen from the button
   * of options menu
   */
  ipcMain.on('addGridElement', (event, args) => {
    const mainWindow = BrowserWindow.fromId(mainWindowId);
    mainWindow.webContents.send('addGridElement', args);

    // only when we focus, we can use the keyboard event in the window
    mainWindow.focus();
  });

  /**
   * adds new grid element chosen from the button
   * of options menu
   */
  ipcMain.on('moveGridElement', (event, elementId) => {
    const mainWindow = BrowserWindow.fromId(mainWindowId);
    mainWindow.webContents.send('moveGridElement', elementId);

    // only when we focus, we can use the keyboard event in the window
    mainWindow.focus();
  });

  /**
   * changes grid element color via. the id it has set
   */
  ipcMain.on('changeGridElementColor', (event, elementIndex, color) => {
    const mainWindow = BrowserWindow.fromId(mainWindowId);
    mainWindow.webContents.send('changeGridElementColor', elementIndex, color);
  });


  /**
   * changes grid element color via. the id it has set
   */
  ipcMain.on('setVisibilityGridElement', (event, elementId, active) => {
    const mainWindow = BrowserWindow.fromId(mainWindowId);
    mainWindow.webContents.send('setVisibilityGridElement', elementId, active);
  });


  /**
   * deletes grid element via. the id it has set
   */
  ipcMain.on('deleteGridElement', (event, args) => {
    const mainWindow = BrowserWindow.fromId(mainWindowId);
    mainWindow.webContents.send('deleteGridElement', args);
  });


  /**
   * sends the getDisplays IPC again to the options window
   * Is invoked from options window
   */
  ipcMain.on('requestDisplays', () => {
    const optionsWindow = BrowserWindow.fromId(optionsWindowId);
    const displays = screen.getAllDisplays();
    optionsWindow.webContents.send('getDisplays', displays, doesRotationScriptExist);
  });

  /**
   * Rotates display with external script.
   */
  ipcMain.on('rotateDisplay', (event, displayIndex, rotation) => {
    execFile('./ScreenOrientationChangeTool.exe', [`${displayIndex}`, `${rotation}`], (err, data) => {
      setTimeout(() => {
        const mainWindow = BrowserWindow.fromId(mainWindowId);
        mainWindow.maximize();

        mainWindow.center();
      }, 333);
    });
  });

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

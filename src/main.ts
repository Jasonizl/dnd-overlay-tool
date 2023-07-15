import { app, BrowserWindow, ipcMain, screen } from "electron";
import * as path from "path";
import {mainWindowSize, optionsWindowSize} from './constants/window';

let mainWindowId = -1;

function createOptionsWindow() {
  const optionsWindow = new BrowserWindow({
    ...optionsWindowSize
  })

  // and load the options.html of the app.
  optionsWindow.loadFile(path.join(__dirname, "../options.html"));
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    ...mainWindowSize,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    },
    transparent: true,
    frame: false,
    resizable: true,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../index.html"));
  mainWindowId = mainWindow.id;

  mainWindow.webContents.openDevTools();
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
    const mainWindow = BrowserWindow.getAllWindows().find((window) => window.id === mainWindowId);
    const currentDisplay = screen.getDisplayNearestPoint({x: mainWindow.getPosition()[0], y: mainWindow.getPosition()[1]});

    if (currentDisplay.workArea.width === mainWindow.getSize()[0] && currentDisplay.workArea.height === mainWindow.getSize()[1]) {
      mainWindow.setSize(mainWindowSize.width, mainWindowSize.height);
    } else {
      mainWindow.setSize(currentDisplay.workArea.width, currentDisplay.workArea.height);
    }

    // set position to the upper left of current display
    mainWindow.setPosition(currentDisplay.bounds.x, currentDisplay.bounds.y);
  });

  // for executing rotation program https://ourcodeworld.com/articles/read/154/how-to-execute-an-exe-file-system-application-using-electron-framework

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
      createOptionsWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

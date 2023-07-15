import { app } from 'electron';

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
export const closeApplication = (): void => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
};

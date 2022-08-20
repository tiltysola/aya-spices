import { app, BrowserWindow, globalShortcut } from 'electron';

import ipcStorage from './handles/storage';
import ipcUtil from './handles/util';
import ipcSystem from './handles/system';
import shurtcut from './service/shurtcut';
import tray from './service/tray';
import session from './utils/session';
import storage from './utils/storage';
import { showWindow } from './windows/main';

/* SingleInstance: ensure only one application at the same time. */
const singleInstance = app.requestSingleInstanceLock();

if (!singleInstance && process.env.ENV !== 'development') {
  app.quit();
}
/* SingleInstance: end */

/* Startup: if app is packaged, start at system startup. */
if (app.isPackaged) {
  /* Win32: start */
  if (process.platform === 'win32' && !storage.get('disble_startup')) {
    app.setLoginItemSettings({
      openAtLogin: true,
      openAsHidden: true,
      args: ['--openAsHidden'],
    });
  }
  /* Win32: end */
}
/* Startup: end */

/* AppReady: start */
app.whenReady().then(() => {
  /* OpenAsHidden: judge if the application started at system startup */
  if (process.argv.indexOf('--openAsHidden') < 0) {
    showWindow();
  }
  /* OpenAsHidden: end */

  /* AppActivated: start */
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      showWindow();
    }
  });
  /* AppActivated: end */

  /* SecondInstance: when second instance started, quit and focus the first instance. */
  app.on('second-instance', () => {
    showWindow();
  });
  /* SecondInstance: end */

  /* IpcSection: communication with f2e. */
  ipcUtil();
  ipcStorage();
  ipcSystem();
  /* IpcSection: end */

  /* SystemTray: start */
  if (process.platform !== 'linux') {
    tray();
  }
  /* SystemTray: end */

  /* ShortCut: start */
  shurtcut();
  /* ShortCut: end */
});
/* AppReady: end */

/* WindowAllClosed: when all windows and trays are closed, quit app. */
app.on('window-all-closed', () => {
  /* !Darwin: start */
  if (process.platform !== 'darwin') {
    if (!session.get('tray') || session.get('tray').isDestroyed()) {
      app.quit();
    }
  }
  /* !Darwin: end */
});
/* WindowAllClosed: end */

/* WillQuit: start */
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
/* WillQuit: end */

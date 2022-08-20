import { BrowserWindow, screen, shell } from 'electron';
import path from 'path';

export let win: BrowserWindow;

const createWindow = () => {
  if (win && !win.isDestroyed()) {
    win.setAlwaysOnTop(true);
    win.focus();
  } else {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    win = new BrowserWindow({
      width: 400,
      height,
      x: width - 400,
      y: 0,
      frame: false,
      resizable: false,
      show: false,
      transparent: true,
      alwaysOnTop: true,
      hasShadow: false,
      webPreferences: {
        nodeIntegration: false,
        preload: path.join(__dirname, './preload.js'),
        webSecurity: false,
      },
    });

    win.once('ready-to-show', () => {
      win.show();
    });

    win.setAlwaysOnTop(true);

    if (process.platform === 'win32') {
      win.setSkipTaskbar(true);
    }

    win.webContents.on('will-navigate', (e, url) => {
      if (!/http:\/\/localhost|file:\/\/\//.test(url)) {
        e.preventDefault();
        shell.openExternal(url);
      }
    });

    process.env.ENV !== 'development'
      ? win.loadFile(path.join(__dirname, '../render/index.html'))
      : win.loadURL(`http://localhost:${process.env.PORT}`);
  }
};

let fadeTimeout: NodeJS.Timeout | null;

export const showWindow = () => {
  if (win && !win.isDestroyed()) {
    win.show();
  } else {
    createWindow();
  }
  if (fadeTimeout) {
    clearTimeout(fadeTimeout);
    fadeTimeout = null;
  }
  win.webContents.send('window_fadein');
};

export const hideWindow = () => {
  if (win && !win.isDestroyed()) {
    fadeTimeout = setTimeout(() => {
      if (win && !win.isDestroyed()) {
        win.hide();
      }
    }, 300);
    win.webContents.send('window_fadeout');
  }
};

// export default createWindow;

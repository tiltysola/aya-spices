import { globalShortcut } from 'electron';
import childProcess from 'child_process'

import path from 'path';
import logger from '../utils/logger';
import { hideWindow, showWindow, win } from '../windows/main';

const foregroundWindowPath = path.join(process.cwd(), './resources/ForegroundWindow/ForegroundWindow.exe')

let hWnd: string | null = null;

export const registerShortcutKey = () => {
  const accelerator = 'Ctrl+Meta+F12';

  globalShortcut.register(accelerator, () => {
    logger.debug('[Suspension]', 'Shortcut key pressed.');
    if (win && !win.isDestroyed()) {
      if (win.isVisible()) {
        hideWindow();
        if (hWnd) {
          childProcess.spawn(foregroundWindowPath, [
            '--set',
            hWnd
          ])
        }
      } else {
        const cp = childProcess.spawn(foregroundWindowPath, [
          '--get',
        ]);
        cp.stdout.on('data', (data) => {
          hWnd = Buffer.from(data).toString()
        })
        cp.on('exit', () => {
          showWindow();
        })
      }
    } else {
      showWindow();
    }
  });
};

export default () => {
  registerShortcutKey();
};

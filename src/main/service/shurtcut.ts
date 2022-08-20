import { globalShortcut } from 'electron';

import logger from '../utils/logger';
import { hideWindow, showWindow, win } from '../windows/main';

export const registerShortcutKey = () => {
  const accelerator = 'Control+Meta+F12';

  globalShortcut.register(accelerator, () => {
    logger.debug('[Suspension]', 'Shortcut key pressed.');
    if (win && !win.isDestroyed()) {
      if (win.isVisible()) {
        hideWindow();
      } else {
        showWindow();
      }
    } else {
      showWindow();
    }
  });
};

export default () => {
  registerShortcutKey();
};

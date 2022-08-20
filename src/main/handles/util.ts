import { app } from 'electron';
import childProcess from 'child_process'
import path from 'path';

import { showWindow } from '../windows/main';
import ipcMain from './constructor';
import logger from '../utils/logger';
import storage from '../utils/storage';

const ryzenAdjPath = path.join(process.cwd(), './resources/ryzenadj-win64/ryzenadj.exe')
const openHardwareMonitorPath = path.join(process.cwd(), './resources/OpenHardwareMonitor/OpenHardwareMonitor.exe')
let OHM: childProcess.ChildProcessWithoutNullStreams | null = null;

let startOHMTry = false;
export const startOHM = () => {
  if (startOHMTry === false && !OHM) {
    startOHMTry = true;
    OHM = childProcess.spawn(openHardwareMonitorPath);
    OHM.stdout.on('data', (data) => {
      logger.debug(Buffer.from(data).toString())
    })
    OHM.on('exit', () => {
      OHM = null;
    })
  }
}

const util = () => {
  ipcMain.on('util_open_main', () => {
    showWindow();
  });

  ipcMain.on('util_start_ohm', (e, tdp) => {
    if (!OHM) {
      OHM = childProcess.spawn(openHardwareMonitorPath);
      OHM.stdout.on('data', (data) => {
        logger.debug(Buffer.from(data).toString())
      })
      OHM.on('exit', () => {
        OHM = null;
      })
    }
  })

  ipcMain.handle('util_get_tdp', (e, tdp) => {
    return storage.get('tdpSaved')
  })

  ipcMain.on('util_set_tdp', (e, tdp) => {
    storage.set('tdpSaved', tdp)
    const args = [
      `--stapm-limit=${tdp * 1000}`,
      `--fast-limit=${tdp * 1000}`,
      `--slow-limit=${tdp * 1000}`,
    ]
    const cp = childProcess.spawn(ryzenAdjPath, args);
    cp.stdout.on('data', (data) => {
      logger.debug(Buffer.from(data).toString())
    })
  })

  ipcMain.on('util_shutdown', () => {
    app.quit();
    app.exit();
  });
};

export default util;

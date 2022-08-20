import wmi from 'node-wmi';

import ipcMain from './constructor';
import { startOHM } from './util';

const system = () => {
  ipcMain.handle('system_ohm_info', async () => {
    return await new Promise((res, rej) => {
      wmi.Query({
        namespace: 'root/OpenHardwareMonitor',
        class: 'Sensor'
      }, (err: any, data: any) => {
        if (err) rej(err);
        else {
          data === undefined && startOHM();
          res(data);
        };
      });
    });
  });

  ipcMain.handle('system_battery_info', async () => {
    const [{ EstimatedChargeRemaining }] = await new Promise((res, rej) => {
      wmi.Query({
        class: 'Win32_Battery'
      }, (err: any, data: any) => {
        if (err) rej(err);
        else res(data);
      });
    });
    const [{ FullChargedCapacity }] = await new Promise((res, rej) => {
      wmi.Query({
        namespace: 'ROOT/WMI',
        class: 'BatteryFullChargedCapacity'
      }, (err: any, data: any) => {
        if (err) rej(err);
        else res(data);
      });
    });
    return {
      estimatedChargeRemaining: EstimatedChargeRemaining,
      fullChargedCapacity: FullChargedCapacity
    }
  });
}

export default system;

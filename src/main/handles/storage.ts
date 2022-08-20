import storage from '../utils/storage';
import ipcMain from './constructor';

const ipcStorage = () => {
  ipcMain.handle('storage_get', (e: any, key: string) => {
    return storage.get(key);
  });

  ipcMain.on('storage_set', (e: any, key: string, value: any) => {
    return storage.set(key, value);
  });
};

export default ipcStorage;

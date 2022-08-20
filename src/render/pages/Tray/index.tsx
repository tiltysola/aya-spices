import { useEffect } from 'react';

import packageJson from 'package.json';

import './style.less';

const Index = () => {
  const handleOpenMain = () => {
    ipcRenderer.send('util_open_main');
  };

  const handleShutdown = () => {
    ipcRenderer.send('util_shutdown');
  };

  useEffect(() => {
    document.getElementById('root')?.classList.add('tray');

    return () => {
      document.getElementById('root')?.classList.remove('tray');
    };
  }, []);

  return (
    <div className="tray">
      <div className="tray-icon">
        <div className="tray-icon-left">
          <img className="tray-icon-left-image" src="./logob.png" />
        </div>
        <div className="tray-icon-right">
          <span className="tray-icon-right-title">AyaSpices</span>
          <span className="tray-icon-right-version">Ver. {packageJson.version}</span>
        </div>
      </div>
      <div className="tray-divider" />
      <ul className="tray-list">
        <li className="tray-item">
          <button className="tray-item-button" onClick={handleOpenMain}>
            打开AyaSpices
          </button>
        </li>
        <li className="tray-item">
          <button className="tray-item-button" onClick={handleShutdown}>
            退出AyaSpices
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Index;

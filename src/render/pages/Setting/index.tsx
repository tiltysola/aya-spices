import Button from '@/components/Button';
import TabCard from '@/components/TabCard';

import './style.less';

const Index = () => {
  return (
    <div className="setting">
      <div className="setting-title">
        <span>设置</span>
      </div>
      <TabCard title="外部应用程序">
        <Button
          title="启动OpenHardwareMonitor"
          onClick={() => {
            ipcRenderer.send('util_start_ohm');
          }}
        />
      </TabCard>
      <TabCard title="其他">
        <Button
          title="关闭程序"
          onClick={() => {
            ipcRenderer.send('util_shutdown');
          }}
        />
      </TabCard>
    </div>
  );
};

export default Index;

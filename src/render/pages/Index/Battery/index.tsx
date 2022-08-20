import { useState } from 'react';

import { useInterval } from 'ahooks';
import numbro from 'numbro';

import Label from '@/components/Label';
import TabCard from '@/components/TabCard';

const Index = () => {
  const [hardwareInfo, setHardwareInfo] = useState<any>();
  const [battery, setBattery] = useState<any>();

  const getHardwareInfo = (type: string) => {
    if (hardwareInfo) {
      switch (type) {
        case 'watt': {
          let current = 0;
          hardwareInfo.forEach((v: any) => {
            if (v.Identifier === '/amdcpu/0/power/0') {
              current = v.Value;
            }
          });
          const watt = numbro(current).format({
            mantissa: 1,
          });
          return `${watt}W`;
        }
        default: return 'Unknown';
      }
    } else {
      return '获取中...';
    }
  };

  const getBatteryInfo = (type: string) => {
    if (battery) {
      switch (type) {
        case 'current': {
          const current = numbro(battery.fullChargedCapacity * battery.estimatedChargeRemaining / 100000).format({
            mantissa: 1,
          });
          return `约${current}Wh (${battery.estimatedChargeRemaining}%)`;
        }
        case 'capacity': {
          const design = numbro(battery.fullChargedCapacity / 1000).format({
            mantissa: 1,
          });
          return `${design}Wh`;
        }
        default: return 'Unknown';
      }
    } else {
      return '获取中...';
    }
  };

  const queryHardwareInfo = () => {
    ipcRenderer.invoke('system_ohm_info').then((res) => {
      setHardwareInfo(res);
    });
  };

  const queryBatteryInfo = () => {
    ipcRenderer.invoke('system_battery_info').then((res) => {
      setBattery(res);
    });
  };

  useInterval(() => {
    queryHardwareInfo();
    queryBatteryInfo();
  }, 5000, {
    immediate: true,
  });

  return (
    <TabCard title={'电池信息'}>
      <Label title="功耗" content={getHardwareInfo('watt')} />
      <Label title="电量" content={getBatteryInfo('current')} />
      <Label title="容量" content={getBatteryInfo('capacity')} />
    </TabCard>
  );
};

export default Index;

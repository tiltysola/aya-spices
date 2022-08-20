import { useEffect, useState } from 'react';

import { useUpdateEffect } from 'ahooks';

import Slider from '@/components/Slider';
import TabCard from '@/components/TabCard';

const Index = () => {
  const [currentTdp, setCurrentTdp] = useState(8);

  useUpdateEffect(() => {
    ipcRenderer.send('util_set_tdp', currentTdp);
  }, [currentTdp]);

  useEffect(() => {
    ipcRenderer.invoke('util_get_tdp').then((tdp) => {
      setCurrentTdp(tdp || 8);
    });
  }, []);

  return (
    <TabCard title="功耗设置">
      <Slider
        title="TDP"
        extra={`${currentTdp}W`}
        min={5}
        max={18}
        marks={{
          5: '省电',
          8: '均衡',
          15: '效能',
          18: '极致',
        }}
        value={currentTdp}
        onChange={(tdp) => {
          setCurrentTdp(tdp as number);
        }}
      />
    </TabCard>
  );
};

export default Index;

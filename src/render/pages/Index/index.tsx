import Battery from './Battery';
import Power from './Power';

import './style.less';

const Index = () => {
  return (
    <div className="index">
      <div className="index-title">
        <span>Aya Spices</span>
      </div>
      <Power />
      <Battery />
    </div>
  );
};

export default Index;

import Slider, { SliderProps } from 'rc-slider';

import './style.less';

interface Props extends SliderProps {
  title: string;
  extra?: string;
  children?: JSX.Element | JSX.Element[] | string;
}

const Index = (props: Props) => {
  const { title, extra } = props;

  return (
    <div className="slider">
      <div className="slider-flex">
        <div className="slider-title">
          <span>{title}</span>
        </div>
        <div className="slider-extra">
          <span>{extra}</span>
        </div>
      </div>
      <div className="slider-content">
        <Slider {...props} />
      </div>
    </div>
  );
};

export default Index;

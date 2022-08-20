import Switch, { SwitchChangeEventHandler, SwitchClickEventHandler } from 'rc-switch';

import './style.less';

interface SwitchProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onChange' | 'onClick'> {
  className?: string;
  prefixCls?: string;
  disabled?: boolean;
  checkedChildren?: React.ReactNode;
  unCheckedChildren?: React.ReactNode;
  onChange?: SwitchChangeEventHandler;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  onClick?: SwitchClickEventHandler;
  tabIndex?: number;
  checked?: boolean;
  defaultChecked?: boolean;
  loadingIcon?: React.ReactNode;
  style?: React.CSSProperties;
  title?: string;
}

interface Props extends SwitchProps {
  title: string;
  children?: JSX.Element | JSX.Element[] | string;
}

const Index = (props: Props) => {
  const { title } = props;

  return (
    <div className="switch">
      <div className="switch-title">
        <span>{title}</span>
      </div>
      <div className="switch-content">
        <Switch {...props} />
      </div>
    </div>
  );
};

export default Index;

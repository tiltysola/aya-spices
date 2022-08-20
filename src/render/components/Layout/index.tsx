import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import classNames from 'classnames';

import { useIpcRenderer } from '@/hooks';

import Icon from '@/components/Icon';

import './style.less';

const menuList = [{
  icon: 'icon-menu',
  path: '/app',
}, {
  icon: 'icon-settings',
  path: '/app/setting',
}];

const Index = () => {
  const [winClassNames, setWinClassNames] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  useIpcRenderer.on('window_fadein', () => {
    setWinClassNames('fadein');
  });

  useIpcRenderer.on('window_fadeout', () => {
    setWinClassNames('fadeout');
  });

  return (
    <div className={classNames('layout', winClassNames)}>
      <div className="layout-nav">
        <ul>
          {menuList.map((v) => (
            <li
              className={classNames({
                active: location.pathname === v.path,
              })}
              onClick={() => {
                navigate(v.path);
              }}
            >
              <Icon type={v.icon} />
            </li>
          ))}
        </ul>
      </div>
      <div className="layout-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Index;

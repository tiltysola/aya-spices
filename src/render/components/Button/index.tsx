import React from 'react';

import './style.less';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
}

function Button(props: Props) {
  const { title } = props;

  return (
    <div className="button">
      <button className="cl-button" {...props}>
        {title}
      </button>
    </div>
  );
}

export default Button;

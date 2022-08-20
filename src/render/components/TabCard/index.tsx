import './style.less';

interface Props {
  title: string;
  children?: JSX.Element | JSX.Element[] | string;
}

const Index = (props: Props) => {
  const { title, children } = props;

  return (
    <div className="tabcard">
      <div className="tabcard-title">
        <span>{title}</span>
      </div>
      <div className="tabcard-content">
        {children}
      </div>
    </div>
  );
};

export default Index;

import './style.less';

interface Props {
  title: string;
  content: string;
}

const Index = (props: Props) => {
  const { title, content } = props;

  return (
    <div className="label">
      <div className="label-title">
        <span>{title}</span>
      </div>
      <div className="label-content">
        <span>{content}</span>
      </div>
    </div>
  );
};

export default Index;

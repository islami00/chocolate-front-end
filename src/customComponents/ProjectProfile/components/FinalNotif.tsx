import { Message } from 'semantic-ui-react';

const FinalNotif: React.FC<{ completed: boolean; error: boolean; status: string }> = function (
  props
) {
  const { status, completed, error } = props;
  const msgProps = { positive: undefined, error: undefined };
  let copiable = '';
  let view = '';
  if (completed) {
    const start = status.search(/[\S]+$/);
    copiable = status.substr(start);
    view = status.substr(0, start);
    msgProps.positive = completed;
  }
  if (error) {
    msgProps.error = error;
    copiable = status;
    view = 'Error';
  }
  return <Message fluid header={view} content={copiable} {...msgProps} />;
};
export { FinalNotif };

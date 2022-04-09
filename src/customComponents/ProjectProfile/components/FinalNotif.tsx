import { Message, MessageProps } from 'semantic-ui-react';

type Stat = 'sending' | 'error' | 'finalized';
const FinalNotif: React.FC<{ state: Stat; status: string }> = function (props) {
  const { status, state } = props;
  const msgProps: MessageProps = { positive: undefined, error: undefined };
  let copiable = '';
  let view = '';
  const icon = <></>;
  // Switch status instead.
  const start = status.search(/[\S]+$/);
  switch (state) {
    case 'sending':
      copiable = status.substring(start);
      view = status.substring(0, start);
      break;
    case 'finalized':
      copiable = status.substring(start);
      view = status.substring(0, start);
      msgProps.positive = true;
      break;
    case 'error':
      msgProps.error = true;
      copiable = status;
      view = 'Error';
      break;
    default:
      // Don't show up on other states.
      return <></>;
  }
  return <Message icon={icon} header={view} content={copiable} {...msgProps} />;
};
export { FinalNotif };

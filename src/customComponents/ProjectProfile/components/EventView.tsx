import { EventRecord } from '@polkadot/types/interfaces';
import { List } from 'semantic-ui-react';

/** this is a faux event view, update this when events are understood better */
const EventView: React.FC<{ event: EventRecord[] }> = function (props) {
  const { event } = props;
  const view = event?.map((record) => {
    const { event: localEvent, phase } = record;
    const types = localEvent.typeDef;
    const text = [<> </>];
    text.push(
      <p key={JSON.stringify(localEvent.section)}>
        {`\t${localEvent.section}:${localEvent.method}:: (phase=${phase.toHuman().toString()})`}
      </p>
    );
    text.push(
      <p key={JSON.stringify(localEvent.meta)}>{`\t\t${String(localEvent.meta.docs.toHuman())}`}</p>
    );

    localEvent.data.forEach((data, index) => {
      text.push(
        <p key={JSON.stringify(types)}>
          {`\t\t\t${types[index].type}: ${String(data.toHuman())}`}{' '}
        </p>
      );
    });
    return <List.Item key={JSON.stringify(localEvent)}>{text}</List.Item>;
  });

  return <List divided>{view}</List>;
};
export { EventView };

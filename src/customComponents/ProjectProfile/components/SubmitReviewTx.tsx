import { EventRecord } from '@polkadot/types/interfaces';
import { Button, Header, Container, Loader } from 'semantic-ui-react';
import { useState, useEffect } from 'react';
import { useApp } from '../../state';
import { useSubstrate } from '../../../substrate-lib';
import { useLoadAccounts } from '../../menuBar';
import { TxButton } from '../../../substrate-lib/components';
import AccountSelector from '../../../AccountSelector';
import { useReviewSend } from '../hooks/useReviewSend';
import { EventView } from './EventView';
import { FinalNotif } from './FinalNotif';

/** Submit review data as transaction */
const SubmitReviewTx: React.FC<{ id: string; cid: string }> = (props) => {
  const [status, setStatus] = useState('');
  const { id, cid } = props;
  const { state } = useApp();
  const { userData } = state;
  const [run, setRun] = useState(false);
  const [event, setEvents] = useState<EventRecord[]>();
  const [completed, setCompleted] = useState<boolean>(undefined);
  const [error, setError] = useState<boolean>(undefined);
  const { keyringState, keyring } = useSubstrate();
  useLoadAccounts(run, setRun);
  const { data: txFee } = useReviewSend({ id, cid }, userData.accountAddress);
  useEffect(() => {
    if (/finalized/i.exec(status)) setCompleted(true);
    else if (/failed/i.exec(status)) setError(true);
  }, [event, status]);
  if (!userData.accountAddress && !keyring)
    return (
      <div>
        <p>Please connect your wallet to proceed</p>
        <Button loading={run || undefined} onClick={() => setRun(true)} primary>
          Connect wallet
        </Button>
      </div>
    );
  const accountPair =
    userData.accountAddress &&
    keyringState === 'READY' &&
    keyring &&
    keyring.getPair(userData.accountAddress);
  return (
    <div className='spaced'>
      <Container className='spaced' fluid>
        <Header>Account Paying</Header>
        <AccountSelector />
        <p>Note: a fee of {txFee} will be applied</p>
      </Container>
      <TxButton
        color='purple'
        disabled={!cid && !accountPair ? true : undefined}
        accountPair={accountPair.meta ? accountPair : undefined}
        label='Submit'
        type='SIGNED-TX'
        setEvent={setEvents}
        setStatus={setStatus}
        attrs={{
          palletRpc: 'chocolateModule',
          callable: 'createReview',
          inputParams: [cid, id],
          paramFields: [true, true],
        }}
      />
      <details placeholder='Events'>{event?.length > 0 && <EventView event={event} />}</details>
      {status && !completed && !error && <Loader content={status} />}
      {(completed || error) && (
        <FinalNotif
          status={status}
          completed={completed ? true : undefined}
          error={error ? true : undefined}
        />
      )}
    </div>
  );
};
export { SubmitReviewTx };

/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { AddressOrPair } from '@polkadot/api/types';
import { EventRecord } from '@polkadot/types/interfaces';
import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import {
  Button,
  Card,
  Container,
  Form,
  Header,
  Image,
  Label,
  List,
  Loader,
  Message,
  Modal,
} from 'semantic-ui-react';
import AccountSelector from '../../AccountSelector';
import { useSubstrate } from '../../substrate-lib';
import { TxButton } from '../../substrate-lib/components';
import { NewMetaData, NewReview } from '../../typeSystem/jsonTypes';
import { useLoadAccounts } from '../menuBar';
import { Rating } from '../Projects';
import { useApp } from '../state';
import { message } from '../utilities/message';
import useCid from './hooks';
import { filter } from './majorUtils';
import './profile.css';
import { ProfileSum, PrProf, RevReel, SubRev, SumRev } from './types';
import useAverage from './useAverage';
import useProject from './useProject';
import useProjectMeta from './useProjectMeta';
import useReviews from './useReviews';

const ProjectProfileSummary: ProfileSum = function (props) {
  const { isFetched } = props;
  if (!isFetched) return <i className="ui loader">"Loading"</i>;
  const { data, ave } = props;
  console.log('abe', ave);
  const { name, icon, Link: site, description } = data;
  const src = `https://avatars.dicebear.com/api/initials/${name}.svg`;
  return (
    <article className="head-profile">
      <section className="left">
        <Rating rating={ave} fixed />
        <Image
          alt="project logo"
          className="project-logo"
          wrapped
          rounded
          src={src}
          ui={false}
        />
      </section>

      <section className="right">
        <h2 className="About">About</h2>
        <p className="about_reviewer">{description}</p>
        <div className="ui two mini buttons">
          <Button as="a" color="purple" href={site} className="wh_top">
            Website
          </Button>
          <Button
            as="a"
            color="purple"
            href={`${site}/whitepaper`}
            className="wh_top"
          >
            Whitepaper
          </Button>
        </div>
      </section>
    </article>
  );
};
/** Send the actual review to chain along with cid */
const useReviewSend = function (
  txData: { id: string; cid: string },
  account: AddressOrPair
) {
  const { id, cid } = txData;
  const { api } = useSubstrate();
  const [fee, setFee] = useState('..loading fee..');
  const getPaymentInfo = async function () {
    const paymentInfo = await api.tx.chocolateModule
      .createReview(cid, id)
      .paymentInfo(account);
    const retFee = paymentInfo.partialFee.toHuman();
    setFee(retFee);
  };
  if (account) getPaymentInfo();
  return { data: fee };
};
/** this is a faux event view, update this when events are understood better */
const EventView: React.FC<{ event: EventRecord[] }> = function (props) {
  const { event } = props;
  const view = event?.map((record) => {
    const { event: localEvent, phase } = record;
    const types = localEvent.typeDef;
    const text = [<> </>];
    text.push(
      <p key={JSON.stringify(localEvent.section)}>
        {`\t${localEvent.section}:${localEvent.method}:: (phase=${phase
          .toHuman()
          .toString()})`}
      </p>
    );
    text.push(
      <p key={JSON.stringify(localEvent.meta)}>{`\t\t${String(
        localEvent.meta.docs.toHuman()
      )}`}</p>
    );

    localEvent.data.forEach((data, index) => {
      text.push(
        <p>{`\t\t\t${types[index].type}: ${String(data.toHuman())}`} </p>
      );
    });
    return <List.Item>{text}</List.Item>;
  });

  return <List divided>{view}</List>;
};

const FinalNotif: React.FC<{
  completed: boolean;
  error: boolean;
  status: string;
}> = function (props) {
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
/** Submit review data as transaction */
const SubmitReviewTx: React.FC<{
  id: string;
  cid: string;
}> = (props) => {
  const [status, setStatus] = useState('');
  const { id, cid } = props;
  const { state } = useApp();
  const { userData } = state;
  const [run, setRun] = useState(false);
  const [event, setEvents] = useState<EventRecord[]>();
  const [completed, setCompleted] = useState<boolean>(undefined);
  const [error, setError] = useState<boolean>(undefined);

  const { keyringState, keyring, api } = useSubstrate();
  useLoadAccounts(run, setRun);
  const { data: txFee } = useReviewSend({ id, cid }, userData.accountAddress);
  useEffect(() => {
    console.log(event);
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
    <div className="spaced">
      <Container className="spaced" fluid>
        <Header>Account Paying</Header>
        <AccountSelector />
        <p>Note: a fee of {txFee} will be applied</p>
      </Container>
      <TxButton
        color="purple"
        disabled={!cid && !accountPair ? true : undefined}
        accountPair={accountPair.meta ? accountPair : undefined}
        label="Submit"
        type="SIGNED-TX"
        setEvent={setEvents}
        setStatus={setStatus}
        attrs={{
          palletRpc: 'chocolateModule',
          callable: 'createReview',
          inputParams: [cid, id],
          paramFields: [true, true],
        }}
      />
      <details placeholder="Events">
        {event?.length > 0 && <EventView event={event} />}
      </details>
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

const SubmitReviewForm: SubRev = function (props) {
  const { id } = useParams<{ id: string }>();
  const [submitted, setSubmitted] = useState(false);
  // form data
  const initForm = { id, cid: '' };
  const [rate, setRate] = useState(0);
  const [submittedReview, setSubmittedReview] = useState(initForm);
  // get cache
  const [review, setReview] = useState('');
  const queryKey = ['project', 'meta', id];
  const qClient = useQueryClient();
  const cachedProj = qClient.getQueryCache().find<NewMetaData>(queryKey);
  const proj = cachedProj.state.data;
  // setup the query, then refetch when data is in place
  const { data, isLoading } = useCid(submitted, review, rate);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };
  // setup conditional renders
  let content;
  // set the submitted review once fetched and submitted
  useEffect(() => {
    if (submitted && !isLoading) setSubmittedReview({ id, cid: data.cid });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted, isLoading, id]);
  if (submitted && !isLoading) {
    content = <SubmitReviewTx {...submittedReview} />;
  } else {
    content = (
      <Form onSubmit={handleSubmit}>
        {/* refactor to select */}
        <Form.Input fluid label="Project" value={proj.name} />
        <Form.TextArea
          label="Body"
          required
          value={review}
          onChange={(e, { name, value }) => setReview(value.toString())}
          placeholder="Write your review here"
        />
        <Rating fixed={false} setOuterRate={setRate} />
        <Form.Button
          content="submit"
          fluid
          color="purple"
          loading={isLoading || undefined}
        />
      </Form>
    );
  }

  return <div>{content}</div>;
};
const SubmitReview: SumRev = function (props) {
  const { disabled } = props;
  const [open, setOpen] = useState(false);
  const reason =
    "You cannot submit a review, this is probably because you, or your selected account owns this project or you've been banned";
  let content;
  if (disabled)
    content = (
      <Button color="purple" title={reason} disabled fluid>
        Submit review
      </Button>
    );
  else {
    content = (
      <Modal
        closeIcon
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        trigger={
          <Button color="purple" className="purple" fluid>
            Submit a review
          </Button>
        }
      >
        <Modal.Header>Submit review</Modal.Header>
        <Modal.Content>
          <SubmitReviewForm />
        </Modal.Content>
      </Modal>
    );
  }
  return <div>{content}</div>;
};

const ReviewSingle: React.FC<{ each: NewReview }> = function (props) {
  const { each } = props;
  const { content, userID, proposalStatus } = each;
  const { keyringState, keyring } = useSubstrate();
  const isProposed = () => proposalStatus.status === 'Proposed';
  const accountPair =
    userID && keyringState === 'READY' && keyring && keyring.getPair(userID);
  const name = accountPair
    ? (accountPair.meta?.name as string | undefined)
    : 'Anonymous';

  // see: https://github.com/polkadot-js/apps/blob/b957353d225da81e4e4b44835e535d9c389a1255/packages/react-hooks/src/useEventTrigger.ts
  const [readMore, setReadMore] = useState(false);
  const { reviewText, rating } = content;
  // limit text to 182 chars once length is more than 450px to preserve height
  const limit = reviewText.length >= 182;
  let rev;
  if (limit) {
    rev = (
      <>
        {readMore ? reviewText : `${reviewText.substring(0, 181)}...`}
        <button
          className="link_button"
          type="button"
          onClick={() => setReadMore(!readMore)}
        >
          {readMore ? 'show less' : '  read more'}
        </button>
      </>
    );
  } else rev = reviewText;
  const src = `https://avatars.dicebear.com/api/identicon/${userID}.svg`;
  return (
    <Card color="purple">
      <Card.Content>
        {isProposed() && (
          <Label color="yellow" ribbon="right">
            {proposalStatus.status}
          </Label>
        )}
        <Card.Header>
          <Image src={src} floated="left" rounded size="mini" />
          <Card.Meta>{name}</Card.Meta>
        </Card.Header>
        <Card.Description>{rev}</Card.Description>
      </Card.Content>
      <Card.Content extra floated="right">
        <Rating rating={rating} fixed />
      </Card.Content>
    </Card>
  );
};
const ReviewReel: RevReel = function (props) {
  const { isFetched, isLoading } = props;
  let renderContent;
  if (!isFetched && isLoading)
    renderContent = <Loader content="loading reviews" />;
  else {
    const { data } = props;
    // patch
    if (!data?.filter) return <Loader content="loading reviews" />;
    const newData = data.filter((each) => each !== undefined && each !== null);
    renderContent = newData?.map((each) => (
      <ReviewSingle each={each} key={JSON.stringify(each)} />
    ));
  }

  return (
    <article className="review_bttm ">
      <h2 className="About review_header card-list">Reviews</h2>
      <Card.Group className="box_indiv">{renderContent}</Card.Group>
    </article>
  );
  /* eslint-enable prettier/prettier */
};
const ProjectProfile: PrProf = function (props) {
  const { data, id } = props;
  const { state } = useApp();
  const { userData } = state;
  const { accountAddress: addr } = userData;
  let canReview = true;
  if (data.ownerID.eq(addr)) canReview = false;
  // race!

  const {
    data: reviews,
    isLoading: lrev,
    isFetched: frev,
  } = useReviews(data, id, addr);

  const {
    data: projectMeta,
    isLoading: lprm,
    isFetched: fproj,
  } = useProjectMeta(data, id);
  // get average ranking
  const [avRate] = useAverage(data, projectMeta, frev, fproj, reviews);
  // structure data here. Button component and the like
  return (
    <main className="profile-wrap">
      <ProjectProfileSummary
        data={projectMeta}
        ave={avRate}
        isFetched={fproj}
        isLoading={lprm}
      />
      <SubmitReview isLoading={lprm || lrev} disabled={!canReview} />
      <ReviewReel data={reviews} isLoading={lrev} isFetched={frev} />
    </main>
  );
};

const Main: React.FC = function () {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useProject(id);
  if (isLoading) return <i className="ui loader" />;
  const four = message('Error, project not found', true);
  if (data === 0) return four;
  const re = filter(data);
  if (re !== 2) {
    if (re === 0)
      return (
        <p>
          This project has been rejected from the chocolate ecosystem due to
          being {data.proposalStatus.reason.toString()}
        </p>
      );
    if (re === 1) return <p>This project is currently proposed</p>;
    return four;
  }
  return <ProjectProfile data={data} id={id} />;
};

export default Main;

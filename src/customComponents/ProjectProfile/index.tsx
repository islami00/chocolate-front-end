import { useEffect, useState } from 'react';
import { Redirect, Route, Switch, useParams } from 'react-router-dom';
import { Button, Card, Image, Loader, Modal } from 'semantic-ui-react';
import { Rating } from '../Projects';
import { useApp } from '../state';
import { loader } from '../utilities';
import { message } from '../utilities/message';
import { ReviewSingle } from './components/ReviewSingle';
import { SubmitReviewForm } from './components/SubmitReviewForm';
import { useAverage, useProject, useProjectMeta, useReviews } from './hooks';
import { noPrjErr } from './hooks/useProject';
import './profile.css';
import { ProfileSum, PrProf, RevReel, SumRev } from './types';

const ProjectProfileSummary: ProfileSum = function (props) {
  const { pQuery, rQuery, project } = props;
  const { data } = pQuery;
  const [ave] = useAverage(project, data, rQuery.isSuccess, pQuery.isSuccess, rQuery.data);
  if (pQuery.isError && !pQuery.data) return <Loader content='Project errror' />; // prettify
  if (!pQuery.isSuccess) return <Loader content='Project loading' />;
  const { name, Link: site, description } = data;
  const src = `https://avatars.dicebear.com/api/initials/${name}.svg`;
  return (
    <article className='head-profile'>
      <section className='left'>
        <Rating rating={ave} fixed />
        <Image alt='project logo' className='project-logo' wrapped rounded src={src} ui={false} />
      </section>

      <section className='right'>
        <h2 className='About'>About</h2>
        <p className='about_reviewer'>{description}</p>
        <div className='ui two mini buttons'>
          <Button as='a' color='purple' href={site} className='wh_top'>
            Website
          </Button>
          <Button as='a' color='purple' href={`${site}/whitepaper`} className='wh_top'>
            Whitepaper
          </Button>
        </div>
      </section>
    </article>
  );
};

const SubmitReview: SumRev = function (props) {
  const { disabled } = props;
  const [open, setOpen] = useState(false);
  const reason =
    "You cannot submit a review, this is probably because you, or your selected account owns this project or you've been banned";
  let content;

  // initial stage for interactive modal. Run only once
  // pathfor interactive modal
  const params = useParams<{ id: string; stage?: string }>();
  const { id } = params;
  const init = params.stage;
  useEffect(() => {
    let interval;
    if (init) interval = setTimeout(() => setOpen(true), 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => clearTimeout(interval);
  }, [init]);
  if (disabled)
    content = (
      <Button color='purple' disabled fluid>
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
          <Button color='purple' className='purple' fluid>
            Submit a review
          </Button>
        }
      >
        <Modal.Header>Submit review</Modal.Header>
        <Modal.Content>
          <Switch>
            <Route exact path='/project/:id/stage/:stage'>
              <SubmitReviewForm />
            </Route>
            <Redirect to={`/project/${id}/stage/1`} />
          </Switch>
        </Modal.Content>
      </Modal>
    );
  }
  return <div title={disabled ? reason : undefined}>{content}</div>;
};

const ReviewReel: RevReel = function (props) {
  const { reelQuery } = props;
  let renderContent: JSX.Element | JSX.Element[];
  if (reelQuery.isError && !reelQuery.data) renderContent = <Loader content='Reviews error' />; // prettify
  if (reelQuery.isLoading) renderContent = <Loader content='loading reviews' />;
  else {
    const data = reelQuery.data || [];
    const newData = data.filter((each) => each !== undefined && each !== null);
    renderContent = newData.map((each) => <ReviewSingle each={each} key={JSON.stringify(each)} />);
  }

  return (
    <article className='review_bttm '>
      <h2 className='About review_header card-list'>Reviews</h2>
      <Card.Group className='box_indiv'>{renderContent}</Card.Group>
    </article>
  );
};
/**
 *
 * @description This component will take over ReviewReel after finishing the useReview top level hook.
 * It will do a better job at error handling, falling back with the api, and
 */
const NewReviewReel = function (props) {};
const ProjectProfile: PrProf = function (props) {
  // const debug = !!process.env.DEBUG; //General.
  const { data, id, rev } = props;
  const { state } = useApp();
  const { userData } = state;
  const { accountAddress: addr } = userData;
  // error handle
  let canReview = true;
  if (data.ownerID.eq(addr)) canReview = false;
  // race!
  // useReviews will need the id and the addr of the calling project.
  // First, it'll grab the keys from the chain in a separate hook, mirroring useProjectKeys
  // Then it'll filter for this Id, return into the body of useReviews to be picked up by useParallelReviews, qKey: ["Reviews",projectID, ownerId].
  // These parallel reviews fetch the metadata from ipfs and are incrementally rendered by the "shouldCalcValid" and arrKeys checks for the queries.

  // The resulting list can then be rendered by the ReviewReel component.
  // Generally, for the state machine, rendering priority happens like this: 1. if there's an error depending on the severity, render.
  // 2. If the error is the api is unavailable, turn on fallback mode for everyone (Arg should be passed from parent since it doesn't touch api directly).
  // 3. If the error is all queries failed, show a definitive error.
  // 4. If we're in initial loading state (i.e all idle or loadingInitially), show a final loading component as reviews are loaded in.
  // 5. If we're done and the list is empty, show good ol' NFound.
  // 6. Default to rendering the list of review cards

  // Test.
  // const reviewQ = useReelData(rev);
  const reviewQuery = useReviews(data, id, addr);
  // const profileQ = useProfileData(rev);
  // if(debug) console.count('Rendered');
  // if(debug) console.log('reviewQ, profileQ', reviewQ, profileQ);
  const projectQuery = useProjectMeta(data, id);
  return (
    <main className='profile-wrap'>
      <ProjectProfileSummary pQuery={projectQuery} project={data} rQuery={reviewQuery} />
      <SubmitReview
        isLoading={reviewQuery.isLoading || projectQuery.isLoading}
        disabled={!canReview}
      />
      <ReviewReel reelQuery={reviewQuery} />
    </main>
  );
};

/**
 * This component handles the initial fetch of the project, loading state UI of the ProjectAl, and sorting them. It's an initial page-wide blanket of <NFound/>
 */
const Main: React.FC = function () {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading: isInitiallyLoading, isError, error, isIdle, status } = useProject(id);
  const isDebug = !!process.env.REACT_APP_DEBUG;
  if (!data) {
    // Ref: https://react-query.tanstack.com/reference/useQuery
    // Three states of concern: Idle
    if (isIdle) {
      // Only possible in fallback.
      return loader('Waiting for Chain connection...'); // Make a more subtle loader.
    }
    // Loading for the first time,
    if (isInitiallyLoading) return loader('Fetching project..');
    // or erred
    if (isError) {
      if (error.message === noPrjErr) return message('Error, project not found', true);
      return message('something went wrong fetching data from the api'); // Make err More subtle, possibly with NFound.
    }
    return message('Undefined state, Project profile');
  }
  if (isDebug) console.assert(data, 'Data undefined');
  if (data[0].proposalStatus.status.isRejected)
    return (
      <p>
        This project has been rejected from the chocolate ecosystem due to being{' '}
        {data[0].proposalStatus.reason.toString()}
      </p>
    );
  if (data[0].proposalStatus.status.isProposed) return <p>This project is currently proposed</p>;
  return <ProjectProfile data={data[0]} id={data[1].toString()} rev={data} />;
};

export default Main;

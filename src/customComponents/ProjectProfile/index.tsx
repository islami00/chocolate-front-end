import { useEffect, useState } from 'react';
import { Redirect, Route, Switch, useParams } from 'react-router-dom';
import { Button, Card, Image, Loader, Modal } from 'semantic-ui-react';
import { Rating } from '../Projects';
import { useApp } from '../state';
import { message } from '../utilities/message';
import { useAverage, useProject, useProjectMeta, useReviews } from './hooks';
import { filter } from './majorUtils';
import './profile.css';
import { ProfileSum, PrProf, RevReel, SumRev } from './types';
import { ReviewSingle } from './components/ReviewSingle';
import { SubmitReviewForm } from './components/SubmitReviewForm';

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
    if (init) setOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
const ProjectProfile: PrProf = function (props) {
  const { data, id } = props;
  const { state } = useApp();
  const { userData } = state;
  const { accountAddress: addr } = userData;
  // error handle
  let canReview = true;
  if (data.ownerID.eq(addr)) canReview = false;
  // race!

  const reviewQuery = useReviews(data, id, addr);
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

const Main: React.FC = function () {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useProject(id);
  if (isLoading) return <Loader />;
  // error handle component
  if (isError) return <Loader content='something went wrong fetching data from the api' />; // needed data got
  const four = message('Error, project not found', true);
  if (data === 0) return four;
  const re = filter(data);
  if (re !== 2) {
    if (re === 0)
      return (
        <p>
          This project has been rejected from the chocolate ecosystem due to being{' '}
          {data.proposalStatus.reason.toString()}
        </p>
      );
    if (re === 1) return <p>This project is currently proposed</p>;
    return four;
  }
  // error handled till here
  return <ProjectProfile data={data} id={id} />;
};

export default Main;
